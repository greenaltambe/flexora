import express from "express";
import { register } from "../controllers/auth.controllers.js";

const router = express.Router();

// route for register
router.post("/register", register);

export default router;
