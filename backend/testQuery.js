import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "./models/exercise.model.js";

dotenv.config();

async function testQuery() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");

		// Simulate the query that will be used
		const targetMuscles = [
			"Chest", "chest",
			"Back", "back",
			"Quadriceps", "quadriceps",
			"Hamstrings", "hamstrings",
			"Shoulders", "shoulders",
			"Core", "core",
			"Glutes", "glutes",
			"Full Body", "full_body",
		];

		const query = {
			published: true,
			$or: [
				{ equipment: { $in: ["None", "Bodyweight"] } },
				{ equipment: { $size: 0 } }
			],
			primary_muscles: { $in: targetMuscles }
		};

		console.log("Testing query:");
		console.log(JSON.stringify(query, null, 2));

		const exercises = await Exercise.find(query).lean();
		console.log(`\nFound ${exercises.length} exercises`);

		if (exercises.length > 0) {
			console.log("\nFirst 10 exercises:");
			exercises.slice(0, 10).forEach((ex, i) => {
				console.log(`${i + 1}. ${ex.name} - ${ex.primary_muscles?.join(", ")}`);
			});
		}

		process.exit(0);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

testQuery();
