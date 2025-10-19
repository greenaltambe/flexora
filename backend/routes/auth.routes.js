import express from "express";
import {
	register,
	verifyEmail,
	logout,
	login,
} from "../controllers/auth.controllers.js";

const router = express.Router();

// route for register and verify email
router.post("/register", register);
router.post("/verify-email", verifyEmail);

// route for login
router.post("/login", login);

// route for logout
router.post("/logout", logout);

export default router;
