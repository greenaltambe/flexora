import mongoose from "mongoose";
const { Schema } = mongoose;

const MealLogEntrySchema = new Schema(
	{
		slotName: String,
		recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", default: null },
		estimatedCalories: Number,
		feedback: {
			type: String,
			enum: ["too_heavy", "too_light", "liked", "disliked", "none"],
			default: "none",
		},
		portionMultiplier: { type: Number, default: 1 },
	},
	{ _id: false }
);

const MealLogSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		date: { type: String, required: true },
		entries: { type: [MealLogEntrySchema], default: [] },
	},
	{ timestamps: true }
);

MealLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const MealLog =
	mongoose.models.MealLog || mongoose.model("MealLog", MealLogSchema);
export default MealLog;
