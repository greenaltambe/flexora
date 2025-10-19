import { createTransporter } from "../config/mail.js";
import {
	generateVerificationEmailHTML,
	generateVerificationEmailText,
} from "./generateVerificationEmail.js";
import {
	generateWelcomeEmailHTML,
	generateWelcomeEmailText,
} from "./generateWelcomeEmail.js";

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
		console.log(`Verification email sent: ${info.messageId}`);
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
		console.log(`Welcome email sent: ${info.messageId}`);
	} catch (error) {
		console.error("Error sending welcome email:", error);
		throw new Error("Could not send welcome email");
	}
};

export { sendVerificationCode, sendWelcomeEmail };
