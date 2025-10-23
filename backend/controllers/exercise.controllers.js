import Exercise from "../models/exercise.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import slugify from "slugify";

// create new exercise
// @route POST /api/exercises/create
// @desc Create new exercise
// @access Private
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
			return res
				.status(400)
				.json({ success: false, message: "Name is required" });
		}

		// get the author from the auth middleware
		const author = await User.findById(req.userId).select("name");
		if (!author) {
			return res
				.status(404)
				.json({ success: false, message: "Author not found" });
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
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				details: errors,
			});
		}
		// Handle duplicate slug error
		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "An exercise with this slug already exists",
			});
		}
		res.status(500).json({
			success: false,
			message: "Server error: " + error.message,
		});
	}
};

// get all exercises
// @route GET /api/exercises/getAll?query
// @desc Get all exercises
// @access Public
const getExercises = async (req, res) => {
	try {
		const queryObj = { ...req.query }; // eg: api/exercises?type=strength&equipment=dumbbell

		// exclude pagination and sorting fields
		const excludedFields = ["page", "sort", "limit", "fields"];
		excludedFields.forEach((field) => delete queryObj[field]);

		// Handle text search for name field
		let nameSearch = null;
		if (queryObj.name) {
			nameSearch = queryObj.name;
			delete queryObj.name;
		}

		// this is to handle array fields when using query params eg tags=tag1&tags=tag2
		// in this case we want all exercises that have tag1 and tag2
		const arrayFields = [
			"equipment",
			"primary_muscles",
			"secondary_muscles",
			"movement_patterns",
			"tags",
		];

		for (const key in queryObj) {
			if (arrayFields.includes(key)) {
				// If Express parsed multiple query params into an array (e.g., ?tags=a&tags=b)
				if (Array.isArray(queryObj[key])) {
					// Use $all to find documents that contain ALL values
					queryObj[key] = { $all: queryObj[key] };
				}
				// If it's just a single string (e.g., ?tags=upper-body),
				// Mongoose automatically knows to find it in the array,
				// so no 'else' is needed.
			}
		}

		// build query
		let query;
		if (nameSearch) {
			// Use text search for name field
			query = Exercise.find({ ...queryObj, name: { $regex: nameSearch, $options: "i" } });
		} else {
			query = Exercise.find(queryObj);
		}

		// sort query
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" "); // e.g., /api/exercises?sort=name or ?sort=-difficulty,name
			query = query.sort(sortBy);
		} else {
			query = query.sort("name"); // Default sort by name
		}

		// field limiting
		let fields;
		if (req.query.fields) {
			fields = req.query.fields.split(",").join(" ");
		} else {
			// Default fields: send a smaller payload for list view
			fields = "name slug type primary_muscles equipment difficulty tags";
		}
		query = query.select(fields);

		// pagination
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 20; // Default limit of 20
		const skip = (page - 1) * limit;

		query = query.skip(skip).limit(limit);

		// Get total document count for pagination metadata
		let countQuery;
		if (nameSearch) {
			countQuery = { ...queryObj, name: { $regex: nameSearch, $options: "i" } };
		} else {
			countQuery = queryObj;
		}
		const totalDocuments = await Exercise.countDocuments(countQuery);

		// EXECUTE QUERY
		const exercises = await query;

		// Send response with pagination metadata
		res.status(200).json({
			success: true,
			message: "Exercises retrieved successfully",
			total: totalDocuments,
			page,
			limit,
			totalPages: Math.ceil(totalDocuments / limit),
			results: exercises.length,
			data: exercises,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server error: " + error.message,
		});
	}
};

// get exercise by id
// @route GET /api/exercises/:id
// @desc Get exercise by id
// @access Public
const getExerciseById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				message: "Invalid exercise ID",
			});
		}

		const exercise = await Exercise.findById(id).populate(
			"alternatives", // The field to populate
			"name slug type difficulty"
		);

		if (!exercise) {
			return res.status(404).json({
				success: false,
				message: "Exercise not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Exercise retrieved successfully",
			data: exercise,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server error: " + error.message,
		});
	}
};

// update exercise
// @route PUT /api/exercises/:id
// @desc Update exercise
// @access Private
const updateExercise = async (req, res) => {
	try {
		const { id } = req.params;

		// validate id
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				message: "Invalid exercise ID",
			});
		}

		// find the exercise first
		const exercise = await Exercise.findById(id);
		if (!exercise) {
			return res.status(404).json({
				success: false,
				message: "Exercise not found",
			});
		}

		// Manually update *only* the fields that should be updatable
		// This prevents mass assignment
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

		// Update fields if they were provided in the request body
		if (name) {
			exercise.name = name;
			exercise.slug = slugify(name, { lower: true, strict: true });
		}

		exercise.description = description || exercise.description;
		exercise.type = type || exercise.type;
		exercise.primary_muscles = primary_muscles || exercise.primary_muscles;
		exercise.secondary_muscles =
			secondary_muscles || exercise.secondary_muscles;
		exercise.movement_patterns =
			movement_patterns || exercise.movement_patterns;
		exercise.equipment = equipment || exercise.equipment;
		exercise.tags = tags || exercise.tags;
		exercise.difficulty = difficulty || exercise.difficulty;
		exercise.modality = modality || exercise.modality;
		exercise.default_prescription =
			default_prescription || exercise.default_prescription;
		exercise.estimated_minutes =
			estimated_minutes || exercise.estimated_minutes;
		exercise.progression = progression || exercise.progression;
		exercise.alternatives = alternatives || exercise.alternatives;
		exercise.contraindications =
			contraindications || exercise.contraindications;
		exercise.video_url = video_url || exercise.video_url;
		exercise.images = images || exercise.images;

		// Explicitly handle boolean
		if (published !== undefined) {
			exercise.published = published;
		}

		// This will trigger your schema validations and hooks!
		const updatedExercise = await exercise.save();

		res.status(200).json({
			success: true,
			message: "Exercise updated successfully",
			data: updatedExercise,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const errors = Object.values(error.errors).map(
				(err) => err.message
			);
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				details: errors,
			});
		}
		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "An exercise with this slug already exists",
			});
		}
		res.status(500).json({
			success: false,
			message: "Server error: " + error.message,
		});
	}
};

// delete exercise
// @route DELETE /api/exercises/:id
// @desc Delete exercise
// @access Private
const deleteExercise = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				message: "Invalid exercise ID",
			});
		}

		const exercise = await Exercise.findByIdAndDelete(id);
		if (!exercise) {
			return res.status(404).json({
				success: false,
				message: "Exercise not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Exercise deleted successfully",
			data: exercise,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server error: " + error.message,
		});
	}
};

// get filter options
// @route GET /api/exercises/getFilters
// @desc Get filter options
// @access Public
const getFilterOptions = async (req, res) => {
	try {
		const aggregationResult = await Exercise.aggregate([
			{
				$facet: {
					equipment: [
						{ $unwind: "$equipment" },
						{ $group: { _id: "$equipment" } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, value: "$_id" } },
					],
					primary_muscles: [
						{ $unwind: "$primary_muscles" },
						{ $group: { _id: "$primary_muscles" } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, value: "$_id" } },
					],
					tags: [
						{ $unwind: "$tags" },
						{ $group: { _id: "$tags" } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, value: "$_id" } },
					],
					movement_patterns: [
						{ $unwind: "$movement_patterns" },
						{ $group: { _id: "$movement_patterns" } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, value: "$_id" } },
					],
					type: [
						{ $group: { _id: "$type" } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, value: "$_id" } },
					],
					modality: [
						{ $group: { _id: "$modality" } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, value: "$_id" } },
					],
				},
			},
			{
				$project: {
					equipment: "$equipment.value",
					primary_muscles: "$primary_muscles.value",
					tags: "$tags.value",
					movement_patterns: "$movement_patterns.value",
					type: "$type.value",
					modality: "$modality.value",
				},
			},
		]);

		const filterOptions = aggregationResult[0] || {
			equipment: [],
			primary_muscles: [],
			tags: [],
			type: [],
			modality: [],
			movement_patterns: [],
		};

		res.status(200).json({
			success: true,
			message: "Filter options retrieved successfully",
			data: filterOptions,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server error: " + error.message,
		});
	}
};

export {
	createExercise,
	getExercises,
	getExerciseById,
	updateExercise,
	deleteExercise,
	getFilterOptions,
};
