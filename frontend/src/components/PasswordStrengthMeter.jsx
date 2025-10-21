import { CheckCircle, XCircle } from "lucide-react";

const PasswordStrengthMeter = ({ password }) => {
	const criteria = [
		{ name: "At least 6 characters", met: password.length >= 6 },
		{ name: "Uppercase letter", met: /[A-Z]/.test(password) },
		{ name: "Lowercase letter", met: /[a-z]/.test(password) },
		{ name: "Number", met: /[0-9]/.test(password) },
		{ name: "Special character", met: /[^a-zA-Z0-9]/.test(password) },
	];

	const metCount = criteria.filter((c) => c.met).length;
	const strengthColors = ["bg-error", "bg-warning", "bg-info", "bg-success"];
	const strengthClass =
		strengthColors[Math.min(Math.floor(metCount / 1.25), 3)] ||
		"bg-base-300";

	return (
		<div className="mt-3">
			{/* Strength Bar */}
			<div className="w-full h-2 rounded-full bg-base-300 overflow-hidden mb-2">
				<div
					className={`h-full transition-all duration-300 ${strengthClass}`}
					style={{ width: `${(metCount / criteria.length) * 100}%` }}
				/>
			</div>

			{/* Criteria List */}
			<ul className="text-sm space-y-1">
				{criteria.map((c) => (
					<li
						key={c.name}
						className={`flex items-center gap-2 ${
							c.met ? "text-success" : "text-base-content/60"
						}`}
					>
						{c.met ? (
							<CheckCircle size={16} className="text-success" />
						) : (
							<XCircle size={16} className="text-error" />
						)}
						{c.name}
					</li>
				))}
			</ul>
		</div>
	);
};

export default PasswordStrengthMeter;
