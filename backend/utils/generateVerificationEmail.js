export const generateVerificationEmailText = (code) => {
	return `Your verification code is: ${code}`;
};

export const generateVerificationEmailHTML = (code) => {
	return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #4CAF50;">Flexora Verification Code</h2>
      <p>Hello,</p>
      <p>Thank you for registering. Your verification code is:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #000;">
        ${code}
      </div>
      <p>This code will expire in <strong>24 hours</strong>.</p>
      <p>Regards,<br/>Flexora Team</p>
    </div>
  `;
};
