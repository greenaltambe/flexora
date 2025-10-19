const generateWelcomeEmailText = () => {
	return `Thank you for registering to Flexora!`;
};

const generateWelcomeEmailHTML = () => {
	return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #4CAF50;">Flexora Welcome Email</h2>
      <p>Hello,</p>
      <p>Thank you for registering to Flexora!</p>
    </div>
  `;
};

export { generateWelcomeEmailText, generateWelcomeEmailHTML };
