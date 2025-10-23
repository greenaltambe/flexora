import express from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {
	getExercises,
	createExercise,
	getExerciseById,
	updateExercise,
	deleteExercise,
	getFilterOptions,
	bulkCreateExercises,
} from "../controllers/exercise.controllers.js";

const router = express.Router();

// exercies routes
router.get("/getAll", verifyToken, getExercises); // get all exercies
router.post("/create", verifyToken, isAdmin, createExercise); // create new exercies
router.post("/bulk-create", verifyToken, isAdmin, bulkCreateExercises); // bulk create exercises from CSV
router.get("/getById/:id", verifyToken, getExerciseById); // get exercies by id
router.put("/update/:id", verifyToken, isAdmin, updateExercise); // update exercies
router.delete("/delete/:id", verifyToken, isAdmin, deleteExercise); // delete exercies
router.get("/getFilters", verifyToken, getFilterOptions); // get filter options

export default router;
