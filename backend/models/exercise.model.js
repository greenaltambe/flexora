// models/exercise.js
import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

const PrescriptionSchema = new Schema(
	{
		sets: { type: Number, default: 3 },
		reps: { type: Number },
		reps_range: { type: [Number], default: undefined }, // [min, max]
		rest_seconds: { type: Number, default: 60 },
		tempo: { type: String, default: null },
		time_minutes: { type: Number, default: null }, // for time-based modalities
		distance_meters: { type: Number, default: null }, // for distance-based modalities
	},
	{ _id: false }
);

const ProgressionSchema = new Schema(
	{
		method: {
			type: String,
			enum: [
				"reps",
				"load",
				"reps_then_load",
				"tempo",
				"time",
				"interval",
			],
			default: "reps",
		},
		micro_step: { type: Number, default: 1 },
		load_step_pct: { type: Number, default: 2.5 },
		sets_before_load_increase: { type: Number, default: 2 },
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
		description: { type: String, default: "" },
		type: {
			type: String,
			enum: ["strength", "cardio", "mobility", "skill", "hybrid"],
			default: "strength",
		},
		primary_muscles: { type: [String], default: [] },
		secondary_muscles: { type: [String], default: [] },
		movement_patterns: { type: [String], default: [] },
		equipment: {
			type: [String],
			default: [],
			set: (arr) =>
				Array.isArray(arr)
					? arr.map((s) => String(s).toLowerCase().trim())
					: arr,
		},
		tags: {
			type: [String],
			default: [],
			set: (arr) =>
				Array.isArray(arr)
					? arr.map((s) => String(s).toLowerCase().trim())
					: arr,
		},
		difficulty: { type: Number, min: 1, max: 5, default: 3 },
		modality: {
			type: String,
			enum: ["reps", "time", "distance", "interval", "rpm"],
			default: "reps",
		},
		default_prescription: { type: PrescriptionSchema, default: () => ({}) },
		estimated_minutes: { type: Number, default: 5 },
		progression: { type: ProgressionSchema, default: () => ({}) },
		// Use ObjectId refs for alternatives for integrity and populate()
		alternatives: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
		contraindications: { type: [String], default: [] },
		video_url: { type: String, default: null },
		images: { type: [String], default: [] },
		author: {
			id: { type: Schema.Types.ObjectId, ref: "User" },
			name: { type: String },
		},
		published: { type: Boolean, default: false },
		meta: { type: Schema.Types.Mixed, default: {} },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// TEXT index for simple search on name + description
ExerciseSchema.index({ name: "text", description: "text" });

// useful indexes for filtering
ExerciseSchema.index({ slug: 1 });
ExerciseSchema.index({ tags: 1 });
ExerciseSchema.index({ equipment: 1 });
ExerciseSchema.index({ movement_patterns: 1 });

// generate slug from name if not provided or if name changed
ExerciseSchema.pre("validate", function (next) {
	if (!this.slug && this.name) {
		this.slug = slugify(this.name, { lower: true, strict: true });
	}
	next();
});

// custom validator example: if modality === 'reps', ensure reps or reps_range exists
ExerciseSchema.path("default_prescription").validate(function (val) {
	if (!val) return true;
	if (this.modality === "reps") {
		return !!(
			val.reps ||
			(Array.isArray(val.reps_range) && val.reps_range.length === 2)
		);
	}
	return true;
}, 'default_prescription must include reps or reps_range when modality is "reps".');

// toJSON transform: convert _id to id and remove __v
ExerciseSchema.set("toJSON", {
	transform(doc, ret) {
		ret.id = String(ret._id);
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

// pre-hook for 'findOneAndDelete' (which is triggered by findByIdAndDelete)
ExerciseSchema.pre("findOneAndDelete", async function (next) {
	try {
		// 'this' is the query object.
		// getFilter() gets the query conditions, e.g., { _id: "68f8eb56a8d97aced3da858a" }
		const docToDelete = await this.model.findOne(this.getFilter());

		if (!docToDelete) {
			return next(); // Document already deleted or not found
		}

		const docId = docToDelete._id;

		// find all other exercises that reference this one and pull the ID
		await this.model.updateMany(
			{ alternatives: docId }, // Find all docs that contain this ID
			{ $pull: { alternatives: docId } } // Pull this ID from their alternatives array
		);

		next();
	} catch (error) {
		next(error);
	}
});

// export model (ESM)
const Exercise =
	mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);
export default Exercise;
