import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "./models/exercise.model.js";

dotenv.config();

async function checkExercises() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");

		const totalCount = await Exercise.countDocuments();
		console.log("Total exercises in database:", totalCount);

		const publishedCount = await Exercise.countDocuments({ published: true });
		console.log("Published exercises:", publishedCount);

		// Check the exact query that will be used
		const testQuery = {
			published: true,
			$or: [
				{ equipment: { $in: ["None", "Bodyweight"] } },
				{ equipment: { $size: 0 } }
			]
		};
		const matchingExercises = await Exercise.find(testQuery).lean();
		console.log("\nExercises matching query:", matchingExercises.length);
		
		if (matchingExercises.length > 0) {
			console.log("\nSample exercises:");
			matchingExercises.slice(0, 10).forEach((ex) => {
				console.log(`- ${ex.name}`);
				console.log(`  Equipment: ${JSON.stringify(ex.equipment)}`);
				console.log(`  Primary muscles: ${ex.primary_muscles?.join(", ")}`);
				console.log(`  Published: ${ex.published}`);
			});
		} else {
			console.log("\n⚠️ NO EXERCISES FOUND!");
			console.log("Checking what's in the database...");
			
			const anyExercise = await Exercise.findOne().lean();
			if (anyExercise) {
				console.log("\nSample exercise from database:");
				console.log(JSON.stringify(anyExercise, null, 2));
			} else {
				console.log("Database is EMPTY - no exercises at all!");
			}
		}

		process.exit(0);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

checkExercises();
