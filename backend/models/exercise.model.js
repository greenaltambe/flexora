import mongoose from "mongoose";
import slugify from "slugify"; // for generating URL-friendly slugs (slugs are unique identifiers in URLs)
import { PrescriptionSchema } from "./prescription.model.js";

const { Schema } = mongoose;

const ProgressionSchema = new Schema(
	{
		method: {
			type: String,
			enum: ["reps", "load", "reps_then_load", "time", "tempo"],
			default: "reps",
		},
		micro_step: { type: Number, default: 1 }, // e.g., +1 rep
		load_step_pct: { type: Number, default: 2.5 }, // percent increase when method=load
		max_weekly_increase_pct: { type: Number, default: 10 },
	},
	{ _id: false }
);

const ExerciseSchema = new Schema(
	{
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		name: { type: String, required: true, trim: true },
		type: {
			type: String,
			enum: ["strength", "cardio", "mobility", "skill", "hybrid"],
			default: "strength",
		},
		primary_muscles: { type: [String], default: [] },
		equipment: { type: [String], default: [] },
		default_prescription: { type: PrescriptionSchema, default: () => ({}) },
		progression: { type: ProgressionSchema, default: () => ({}) },
		alternatives: [{ type: Schema.Types.ObjectId, ref: "Exercise" }], // optional swaps
		video_url: { type: String, default: null },
		published: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

// text index for searching exercises by name
ExerciseSchema.index({ name: "text" });

ExerciseSchema.pre("validate", function (next) {
	if (!this.slug && this.name)
		this.slug = slugify(this.name, { lower: true, strict: true });
	next();
});

const Exercise =
	mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);
export default Exercise;
