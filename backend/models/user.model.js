import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verificationCodeHash: {
			type: String,
			default: null,
		},
		verificationCodeExpiry: {
			type: Date,
			default: null,
		},
		resetTokenHash: {
			type: String,
			default: null,
		},
		resetTokenExpiry: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
