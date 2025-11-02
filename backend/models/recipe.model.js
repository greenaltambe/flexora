import mongoose from "mongoose";
const { Schema } = mongoose;

const RecipeSchema = new Schema(
	{
		externalId: { type: String, default: null },
		source: {
			type: String,
			enum: ["mock", "spoonacular", "edamam", "manual"],
			default: "mock",
		},
		title: { type: String, required: true },
		servings: { type: Number, default: 1 },
		prep_minutes: { type: Number, default: null },
		cook_minutes: { type: Number, default: null },
		total_calories: { type: Number, default: null },
		protein_g: { type: Number, default: null },
		carbs_g: { type: Number, default: null },
		fat_g: { type: Number, default: null },
		nutrition: { type: Schema.Types.Mixed, default: {} },
		ingredients: [{ name: String, quantity: String }],
		instructions: { type: [String], default: [] },
		dietLabels: { type: [String], default: [] },
		allergies: { type: [String], default: [] },
		image: { type: String, default: null },
		url: { type: String, default: null },
	},
	{ timestamps: true }
);

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);
export default Recipe;
