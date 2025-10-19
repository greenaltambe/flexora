import { createTransporter } from "../../config/mail.js";
import {
	generateVerificationEmailHTML,
	generateVerificationEmailText,
} from "./generateVerificationEmail.js";
import {
	generateWelcomeEmailHTML,
	generateWelcomeEmailText,
} from "./generateWelcomeEmail.js";
import {
	generateResetPasswordEmailHTML,
	generateResetPasswordEmailText,
} from "./generateResetPasswordEmail.js";
import {
	generateSuccessPasswordResetEmailHTML,
	generateSuccessPasswordResetEmailText,
} from "./generateSuccessPasswordResetEmail.js";

// send verification code
const sendVerificationCode = async (email, code) => {
	try {
		const transporter = createTransporter();

		const mailOptions = {
			from: process.env.SMTP_USER,
			to: email,
			subject: "Verification Code",
			text: generateVerificationEmailText(code),
			html: generateVerificationEmailHTML(code),
		};

		const info = await transporter.sendMail(mailOptions);
		console.log(`Verification email sent: ${info.messageId}`.blue.bold);
	} catch (error) {
		console.error("Error sending verification email:", error);
		throw new Error("Could not send verification email");
	}
};

// send welcome email after verification
const sendWelcomeEmail = async (email) => {
	try {
		const transporter = createTransporter();

		const mailOptions = {
			from: process.env.SMTP_USER,
			to: email,
			subject: "Welcome to Flexora",
			text: generateWelcomeEmailText(),
			html: generateWelcomeEmailHTML(),
		};

		const info = await transporter.sendMail(mailOptions);
		console.log(`Welcome email sent: ${info.messageId}`.blue.bold);
	} catch (error) {
		console.error("Error sending welcome email:", error);
		throw new Error("Could not send welcome email");
	}
};

// send reset password code
const sendResetPasswordCode = async (email, resetURL) => {
	try {
		const transporter = createTransporter();

		const mailOptions = {
			from: process.env.SMTP_USER,
			to: email,
			subject: "Reset Password Code",
			text: generateResetPasswordEmailText(resetURL),
			html: generateResetPasswordEmailHTML(resetURL),
		};

		const info = await transporter.sendMail(mailOptions);
		console.log(`Reset password email sent: ${info.messageId}`.blue.bold);
	} catch (error) {
		console.error("Error sending reset password email:", error);
		throw new Error("Could not send reset password email");
	}
};

const sendSuccessPasswordResetEmail = async (email) => {
	try {
		const transporter = createTransporter();

		const mailOptions = {
			from: process.env.SMTP_USER,
			to: email,
			subject: "Password Reset Successful",
			text: generateSuccessPasswordResetEmailText(),
			html: generateSuccessPasswordResetEmailHTML(),
		};

		const info = await transporter.sendMail(mailOptions);
		console.log(
			`Success password reset email sent: ${info.messageId}`.blue.bold
		);
	} catch (error) {
		console.error("Error sending success password reset email:", error);
		throw new Error("Could not send success password reset email");
	}
};

export {
	sendVerificationCode,
	sendWelcomeEmail,
	sendResetPasswordCode,
	sendSuccessPasswordResetEmail,
};
