import express from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {
	getExercises,
	createExercise,
	// getExerciseById,
	// updateExercise,
	// deleteExercise,
} from "../controllers/exercise.controllers.js";

const router = express.Router();

// exercies routes
router.get("/getAll", verifyToken, getExercises); // get all exercies
router.post("/create", verifyToken, isAdmin, createExercise); // create new exercies
// router.get("/:id", verifyToken, getExerciseById); // get exercies by id
// router.put("/:id", verifyToken, isAdmin, updateExercise); // update exercies
// router.delete("/:id", verifyToken, isAdmin, deleteExercise); // delete exercies

export default router;
