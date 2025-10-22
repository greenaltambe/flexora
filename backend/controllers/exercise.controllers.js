import Exercise from "../models/exercise.model.js";
import User from "../models/user.model.js";

const createExercise = async (req, res) => {
	try {
		// Destructure relevant fields from req.body
		const {
			name,
			description,
			type,
			primary_muscles,
			secondary_muscles,
			movement_patterns,
			equipment,
			tags,
			difficulty,
			modality,
			default_prescription,
			estimated_minutes,
			progression,
			alternatives,
			contraindications,
			video_url,
			images,
			published,
		} = req.body;

		// Validate required fields
		if (!name) {
			return res.status(400).json({ error: "Name is required" });
		}

		// get the author from the auth middleware
		const author = await User.findById(req.userId).select("name");
		if (!author) {
			return res.status(404).json({ error: "Author not found" });
		}

		// Create exercise object
		const exerciseData = {
			name,
			description: description || "",
			type: type || "strength",
			primary_muscles: primary_muscles || [],
			secondary_muscles: secondary_muscles || [],
			movement_patterns: movement_patterns || [],
			equipment: equipment || [],
			tags: tags || [],
			difficulty: difficulty || 3,
			modality: modality || "reps",
			default_prescription: default_prescription || {},
			estimated_minutes: estimated_minutes || 5,
			progression: progression || {},
			alternatives: alternatives || [],
			contraindications: contraindications || [],
			video_url: video_url || null,
			images: images || [],
			published: published !== undefined ? published : false,
			author: {
				id: author._id,
				name: author.name,
			},
		};

		// Create and save the exercise
		const exercise = new Exercise(exerciseData);
		await exercise.save();

		// Return the created exercise
		res.status(201).json({
			message: "Exercise created successfully",
			exercise,
		});
	} catch (error) {
		// Handle specific Mongoose validation errors
		if (error.name === "ValidationError") {
			const errors = Object.values(error.errors).map(
				(err) => err.message
			);
			return res
				.status(400)
				.json({ error: "Validation failed", details: errors });
		}
		// Handle duplicate slug error
		if (error.code === 11000) {
			return res
				.status(400)
				.json({ error: "An exercise with this slug already exists" });
		}
		res.status(500).json({ error: "Server error: " + error.message });
	}
};

export { createExercise };
