import crypto from "crypto";

export default function generateVerificationCode() {
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
}
