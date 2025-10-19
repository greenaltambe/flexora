import { createTransporter } from "../config/mail.js";
import {
	generateVerificationEmailHTML,
	generateVerificationEmailText,
} from "./generateVerificationEmail.js";

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

export { sendVerificationCode };
