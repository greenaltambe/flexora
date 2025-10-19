import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

export const createTransporter = () => {
	return nodemailer.createTransport({
		host: process.env.SMTP_HOST || "smtp.gmail.com",
		port: Number(process.env.SMTP_PORT) || 587,
		secure: process.env.SMTP_SECURE === "true",
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
};

// test email
// const transporter = createTransporter();

// const info = await transporter.sendMail({
// 	from: '"Flexora" <greenaltambe1@gmail.com>',
// 	to: "greenaltambedisposable1@gmail.com",
// 	subject: "Hello from Nodemailer",
// 	text: "This is a test email",
// 	html: "<b>This is a test email</b>",
// });

// console.log("Message sent:", info.messageId);
