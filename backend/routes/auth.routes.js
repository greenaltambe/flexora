import express from "express";
import { register, verifyEmail } from "../controllers/auth.controllers.js";

const router = express.Router();

// route for register
router.post("/register", register);
router.post("/verify-email", verifyEmail);

export default router;
