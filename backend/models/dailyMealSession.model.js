import mongoose from "mongoose";
const { Schema } = mongoose;

const SessionMealSchema = new Schema(
	{
		slotName: String,
		plannedRecipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
		plannedCalories: Number,
		plannedProtein_g: Number,
		plannedCarbs_g: Number,
		plannedFat_g: Number,
	},
	{ _id: false }
);

const DailyMealSessionSchema = new Schema(
	{
		userDietPlanId: {
			type: Schema.Types.ObjectId,
			ref: "UserDietPlan",
			default: null,
		},
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		date: { type: String, required: true }, // YYYY-MM-DD
		meals: { type: [SessionMealSchema], default: [] },
		generatedBy: { type: String, default: "template" },
	},
	{ timestamps: true }
);

DailyMealSessionSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyMealSession =
	mongoose.models.DailyMealSession ||
	mongoose.model("DailyMealSession", DailyMealSessionSchema);
export default DailyMealSession;
