import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import { generateJWTAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationCode } from "../utils/emails.js";

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

		// Set JWT and cookie
		generateJWTAndSetCookie(res, user._id);

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

export { register };
