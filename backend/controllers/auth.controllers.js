import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
	generateVerificationCode,
	generateJWTAndSetCookie,
	sendVerificationCode,
	sendWelcomeEmail,
} from "../utils/index.js";
import crypto from "crypto";

// Register
// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		// check if all fields are provided
		if (!firstName || !lastName || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// check if user already exists
		const userAlreadyExists = await User.findOne({ email });
		if (userAlreadyExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		// hash password for security
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// email verification
		const { verificationCode, verificationCodeHash } =
			generateVerificationCode();

		// create new user
		const newUser = {
			firstName,
			lastName,
			email,
			password: hashedPassword,
			verificationCodeHash,
			verificationCodeExpiry: Date.now() + 24 * 60 * 60 * 1000, // valid for 24 hours
		};

		const user = await User.create(newUser);

		// // Set JWT and cookie
		// generateJWTAndSetCookie(res, user._id);

		// Send verification code to user's email
		sendVerificationCode(user.email, verificationCode);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc, // spread operator to get all user properties
				password: undefined,
			},
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Verify email
// @desc Verify user's email
// @route POST /api/auth/verify-email
// @access Public
const verifyEmail = async (req, res) => {
	try {
		const { email, verificationCode } = req.body;

		// check if all fields are provided
		if (!email || !verificationCode) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		// check if verification code is valid
		if (user.verificationCodeExpiry < Date.now()) {
			return res
				.status(400)
				.json({ message: "Verification code expired" });
		}

		// check if verification code is valid
		const hashedCode = crypto
			.createHash("sha256")
			.update(verificationCode)
			.digest("hex");

		if (hashedCode !== user.verificationCodeHash) {
			return res
				.status(400)
				.json({ message: "Invalid verification code" });
		}

		// mark user as verified
		user.isVerified = true;
		user.verificationCodeHash = undefined;
		user.verificationCodeExpiry = undefined;
		await user.save();

		// Set JWT and cookie
		generateJWTAndSetCookie(res, user._id);

		// send success verification email
		sendWelcomeEmail(user.email);

		// send success response
		res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export { register, verifyEmail };
