import Exercise from "../models/exercise.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import slugify from "slugify";
import {
	MAX_ROWS,
	parseCSVLine,
	parseArrayField,
	parseBoolean,
	parseInteger,
	ensureUniqueSlug,
} from "../utils/index.js";

function normalizePrescription(p) {
	if (!p) return {};
	const out = { ...p };
	// support clients that still send time_minutes — convert to seconds
	if (p.time_minutes !== undefined && p.time_seconds === undefined) {
		out.time_seconds = Number(p.time_minutes) * 60;
		delete out.time_minutes;
	}
	return out;
}

// create new exercise
// @route POST /api/exercises/create
// @desc Create new exercise
// @access Private
const createExercise = async (req, res) => {
	try {
		const {
			name,
			description,
			type,
			primary_muscles,
			equipment,
			default_prescription,
			progression,
			alternatives,
			contraindications,
			video_url,
			published,
		} = req.body;

		if (!name) return res.status(400).json({ message: "Name required" });

		const author = await User.findById(req.user.id).select(
			"firstName lastName"
		);
		if (!author)
			return res.status(404).json({ message: "Author not found" });

		const doc = {
			slug:
				(req.body.slug && String(req.body.slug).trim()) ||
				slugify(name, { lower: true, strict: true }),
			name: name.trim(),
			description: description || "",
			type: type || "strength",
			primary_muscles: primary_muscles || [],
			equipment: equipment || [],
			default_prescription:
				normalizePrescription(default_prescription) || {},
			progression: progression || {},
			alternatives: alternatives || [],
			contraindications: contraindications || [],
			video_url: video_url || null,
			published: published !== undefined ? Boolean(published) : false,
			// keep author minimal
			author: {
				id: author._id,
				name: `${author.firstName} ${author.lastName}`,
			},
		};

		const exercise = new Exercise(doc);
		await exercise.save();

		return res.status(201).json({ exercise });
	} catch (err) {
		console.error(err);
		if (err.name === "ValidationError") {
			const errors = Object.values(err.errors).map((e) => e.message);
			return res
				.status(400)
				.json({ message: "Validation failed", errors });
		}
		if (err.code === 11000)
			return res.status(400).json({ message: "Duplicate slug" });
		return res.status(500).json({ message: err.message });
	}
};

// get all exercises
// @route GET /api/exercises/getAll?query
// @desc Get all exercises
// @access Public
const getExercises = async (req, res) => {
	try {
		const q = { ...req.query };
		const excluded = ["page", "sort", "limit", "fields", "name"];
		excluded.forEach((k) => delete q[k]);

		// handle simple array queries (equipment=... or equipment=a&equipment=b)
		const arrayFields = ["equipment", "primary_muscles", "tags"];
		for (const k of arrayFields) {
			if (req.query[k]) {
				if (Array.isArray(req.query[k])) q[k] = { $all: req.query[k] };
				else q[k] = req.query[k];
			}
		}

		let query;
		if (req.query.name) {
			query = Exercise.find({
				...q,
				name: { $regex: req.query.name, $options: "i" },
			});
		} else {
			query = Exercise.find(q);
		}

		// sort
		if (req.query.sort)
			query = query.sort(req.query.sort.split(",").join(" "));
		else query = query.sort("name");

		// fields
		if (req.query.fields)
			query = query.select(req.query.fields.split(",").join(" "));
		else
			query = query.select(
				"name slug type primary_muscles equipment default_prescription.published"
			);

		// pagination
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 20;
		const skip = (page - 1) * limit;
		query = query.skip(skip).limit(limit);

		const total = await Exercise.countDocuments({ ...q });
		const results = await query.lean();

		return res.json({ total, page, limit, results });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

// get exercise by id
// @route GET /api/exercises/:id
// @desc Get exercise by id
// @access Public
const getExerciseById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).json({ message: "Invalid id" });

		const ex = await Exercise.findById(id).populate(
			"alternatives",
			"name slug type"
		);
		if (!ex) return res.status(404).json({ message: "Exercise not found" });
		return res.json({ exercise: ex });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

// update exercise
// @route PUT /api/exercises/:id
// @desc Update exercise
// @access Private
const updateExercise = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).json({ message: "Invalid id" });

		const ex = await Exercise.findById(id);
		if (!ex) return res.status(404).json({ message: "Not found" });

		const body = req.body;

		if (body.name) {
			ex.name = body.name;
			ex.slug = slugify(body.name, { lower: true, strict: true });
		}
		if (body.description !== undefined) ex.description = body.description;
		if (body.type !== undefined) ex.type = body.type;
		if (body.primary_muscles !== undefined)
			ex.primary_muscles = body.primary_muscles;
		if (body.equipment !== undefined) ex.equipment = body.equipment;
		if (body.default_prescription !== undefined)
			ex.default_prescription = normalizePrescription(
				body.default_prescription
			);
		if (body.progression !== undefined) ex.progression = body.progression;
		if (body.alternatives !== undefined)
			ex.alternatives = body.alternatives;
		if (body.contraindications !== undefined)
			ex.contraindications = body.contraindications;
		if (body.video_url !== undefined) ex.video_url = body.video_url;
		if (body.published !== undefined)
			ex.published = Boolean(body.published);

		const saved = await ex.save();
		return res.json({ exercise: saved });
	} catch (err) {
		console.error(err);
		if (err.name === "ValidationError") {
			const errors = Object.values(err.errors).map((e) => e.message);
			return res
				.status(400)
				.json({ message: "Validation failed", errors });
		}
		if (err.code === 11000)
			return res.status(400).json({ message: "Duplicate slug" });
		return res.status(500).json({ message: err.message });
	}
};

// delete exercise
// @route DELETE /api/exercises/:id
// @desc Delete exercise
// @access Private
const deleteExercise = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(400).json({ message: "Invalid id" });
		const ex = await Exercise.findByIdAndDelete(id);
		if (!ex) return res.status(404).json({ message: "Not found" });
		return res.json({ message: "Deleted", exercise: ex });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

// get filter options
// @route GET /api/exercises/getFilters
// @desc Get filter options
// @access Public
const getFilterOptions = async (req, res) => {
	try {
		const agg = await Exercise.aggregate([
			{
				$facet: {
					equipment: [
						{
							$unwind: {
								path: "$equipment",
								preserveNullAndEmptyArrays: true,
							},
						},
						{ $match: { equipment: { $ne: null } } },
						{ $group: { _id: "$equipment" } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, value: "$_id" } },
					],
					primary_muscles: [
						{
							$unwind: {
								path: "$primary_muscles",
								preserveNullAndEmptyArrays: true,
							},
						},
						{ $match: { primary_muscles: { $ne: null } } },
						{ $group: { _id: "$primary_muscles" } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, value: "$_id" } },
					],
					// add tags/movement_patterns if you later add them to schema
					type: [
						{ $group: { _id: "$type" } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, value: "$_id" } },
					],
				},
			},
			{
				$project: {
					equipment: "$equipment.value",
					primary_muscles: "$primary_muscles.value",
					type: "$type.value",
				},
			},
		]);

		const result = (agg && agg[0]) || {
			equipment: [],
			primary_muscles: [],
			type: [],
		};
		return res.json({ success: true, data: result });
	} catch (err) {
		console.error("getFilterOptions error:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
};

// bulk create exercises from CSV
// @route POST /api/exercises/bulk-create
// @desc Create multiple exercises from CSV
// @access Private/Admin
const bulkCreateExercises = async (req, res) => {
	try {
		// Admin-only route: ensure calling code has already checked req.user.role === 'admin'
		const csvContent = req.body.csvContent;
		if (!csvContent)
			return res
				.status(400)
				.json({ success: false, message: "csvContent is required" });

		// split lines and remove empty lines
		const rawLines = csvContent
			.split(/\r?\n/)
			.map((l) => l.replace(/\u00A0/g, " ").trim())
			.filter((l) => l.length > 0);
		if (rawLines.length < 2) {
			return res.status(400).json({
				success: false,
				message:
					"CSV must contain a header row and at least one data row",
			});
		}

		if (rawLines.length - 1 > MAX_ROWS) {
			return res.status(413).json({
				success: false,
				message: `Too many rows. Limit is ${MAX_ROWS}`,
			});
		}

		// Parse header
		const headers = parseCSVLine(rawLines[0]).map((h) => (h || "").trim());

		// get author info for audit fields
		const author = await User.findById(req.user.id).select(
			"firstName lastName"
		);
		if (!author)
			return res.status(404).json({
				success: false,
				message: "Author (admin user) not found",
			});

		const created = [];
		const skipped = [];
		const errors = [];

		// process rows sequentially (keeps memory predictable and triggers mongoose hooks)
		for (let i = 1; i < rawLines.length; i++) {
			const rowNum = i + 1; // human-friendly
			const line = rawLines[i];
			let values;
			try {
				values = parseCSVLine(line);
			} catch (parseErr) {
				errors.push({
					row: rowNum,
					message:
						"CSV parse error: " + (parseErr.message || parseErr),
				});
				continue;
			}

			// map header -> value
			const row = {};
			headers.forEach((h, idx) => {
				row[h] = values[idx] !== undefined ? values[idx] : "";
			});

			const name = (row.name || "").trim();
			if (!name) {
				errors.push({
					row: rowNum,
					message: "Missing required 'name' field",
				});
				continue;
			}

			// avoid duplicate by name (case-insensitive)
			const exists = await Exercise.findOne({
				name: { $regex: new RegExp(`^${name}$`, "i") },
			}).lean();
			if (exists) {
				skipped.push({ row: rowNum, name, reason: "duplicate name" });
				continue;
			}

			// parse common fields defensively
			const primary_muscles = parseArrayField(
				row.primary_muscles || row.primaryMuscles || ""
			);
			const secondary_muscles = parseArrayField(
				row.secondary_muscles || row.secondaryMuscles || ""
			);
			const movement_patterns = parseArrayField(
				row.movement_patterns || row.movementPatterns || ""
			);
			const equipment = parseArrayField(row.equipment || "");
			const tags = parseArrayField(row.tags || "");
			const contraindications = parseArrayField(
				row.contraindications || ""
			);
			const images = parseArrayField(row.images || "");
			const video_url =
				(row.video_url || row.videoUrl || "").trim() || null;

			const difficulty = parseInteger(row.difficulty, 3);
			const modality = (row.modality || "reps").trim();

			// prescription parsing: prefer explicit numeric fields. Accept either time_minutes or time_seconds.
			const sets = parseInteger(row.sets, undefined);
			const reps = parseInteger(row.reps, undefined);
			const rest_seconds = parseInteger(row.rest_seconds, undefined);
			// support old CSVs that used time_minutes
			const time_minutes = parseInteger(row.time_minutes, undefined);
			const time_seconds = parseInteger(row.time_seconds, undefined);
			const distance_meters = parseInteger(
				row.distance_meters,
				undefined
			);
			const load_kg = parseInteger(row.load_kg, undefined);

			const default_prescription = {};
			if (sets !== undefined) default_prescription.sets = sets;
			if (reps !== undefined) default_prescription.reps = reps;
			if (rest_seconds !== undefined)
				default_prescription.rest_seconds = rest_seconds;
			if (time_seconds !== undefined)
				default_prescription.time_seconds = time_seconds;
			else if (time_minutes !== undefined)
				default_prescription.time_seconds = time_minutes * 60;
			if (distance_meters !== undefined)
				default_prescription.distance_meters = distance_meters;
			if (load_kg !== undefined) default_prescription.load_kg = load_kg;

			const estimated_minutes = parseInteger(row.estimated_minutes, 5);
			const published = parseBoolean(row.published || "false");
			const type = (row.type || "strength").trim();

			// slug: use provided slug or generate and ensure unique using utils
			let baseSlug = (row.slug || "").trim();
			if (!baseSlug)
				baseSlug = slugify(name, { lower: true, strict: true });
			let slug;
			try {
				slug = await ensureUniqueSlug(baseSlug);
			} catch (slugErr) {
				errors.push({
					row: rowNum,
					name,
					message:
						"Failed to generate unique slug: " +
						(slugErr.message || slugErr),
				});
				continue;
			}

			const doc = {
				slug,
				name,
				description: row.description || "",
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
				contraindications,
				video_url,
				images,
				published,
				author: {
					id: author._id,
					name: `${author.firstName} ${author.lastName}`,
				},
			};

			try {
				const ex = new Exercise(doc);
				await ex.save();
				created.push({ row: rowNum, id: ex._id, name: ex.name });
			} catch (saveErr) {
				// validation or unique-key failure
				const msg =
					saveErr && saveErr.message
						? saveErr.message
						: String(saveErr);
				errors.push({ row: rowNum, name, message: msg });
			}
		} // end for

		const summary = {
			created: created.length,
			skipped: skipped.length,
			errors: errors.length,
		};

		return res.status(201).json({
			success: true,
			message: "Bulk import finished",
			summary,
			created,
			skipped,
			errors,
		});
	} catch (err) {
		console.error("bulkCreateExercises error:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
};

export {
	createExercise,
	getExercises,
	getExerciseById,
	updateExercise,
	deleteExercise,
	getFilterOptions,
	bulkCreateExercises,
};
