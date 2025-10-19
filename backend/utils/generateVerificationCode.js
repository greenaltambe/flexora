import crypto from "crypto";

// this is for email verification
const generateVerificationCode = () => {
	// 6-digit numeric code (000000 - 999999)
	const verificationCode = Math.floor(
		100000 + Math.random() * 900000
	).toString();

	// Hash the code to store in DB
	const verificationCodeHash = crypto
		.createHash("sha256")
		.update(verificationCode)
		.digest("hex");

	return { verificationCode, verificationCodeHash };
};

// this is for reset password
const generateResetPasswordCode = () => {
	// 6-digit numeric code (000000 - 999999)
	const resetPasswordCode = Math.floor(
		100000 + Math.random() * 900000
	).toString();

	// Hash the code to store in DB
	const resetPasswordCodeHash = crypto
		.createHash("sha256")
		.update(resetPasswordCode)
		.digest("hex");

	return { resetPasswordCodeHash };
};

export { generateVerificationCode, generateResetPasswordCode };
