import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		if (e && e.preventDefault) e.preventDefault();
		// replace with actual verification logic later
		navigate("/");
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace") {
			if (code[index] === "" && index > 0) {
				inputRefs.current[index - 1]?.focus();
			} else {
				const newCode = [...code];
				newCode[index] = "";
				setCode(newCode);
			}
		}
		if (e.key.length === 1 && !/^[0-9a-zA-Z]$/.test(e.key)) {
			e.preventDefault();
		}
	};

	const handleCodeChange = (e, index) => {
		const value = e.target.value;
		const newCode = [...code];

		if (value.length > 1) {
			const pasted = value.slice(0, 6 - index).split("");
			for (let i = 0; i < pasted.length; i++) {
				newCode[index + i] = pasted[i];
			}
			setCode(newCode);
			const nextIndex = Math.min(index + pasted.length, 5);
			inputRefs.current[nextIndex]?.focus();
		} else {
			const char = value.slice(-1);
			newCode[index] = char;
			setCode(newCode);
			if (char && index < 5) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	useEffect(() => {
		if (code.every((v) => v !== "")) {
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [code]);

	return (
		<div className="card w-96 bg-base-100 shadow-xl">
			<div className="card-body">
				<h2 className="card-title">Verify Your Email</h2>
				<p className="text-sm text-base-content/70">
					Enter the 6-digit verification code sent to your email.
				</p>

				<form onSubmit={handleSubmit} className="mt-4">
					<div className="join w-full justify-between">
						{code.map((val, idx) => (
							<input
								key={idx}
								ref={(el) => (inputRefs.current[idx] = el)}
								type="text"
								inputMode="numeric"
								maxLength={1}
								className="input input-bordered join-item w-12 text-center text-lg p-2"
								placeholder="0"
								value={val}
								onKeyDown={(e) => handleKeyDown(e, idx)}
								onChange={(e) => handleCodeChange(e, idx)}
								aria-label={`Verification digit ${idx + 1}`}
							/>
						))}
					</div>
					<button
						type="submit"
						className="btn btn-primary mt-4"
						style={{ width: "100%" }}
					>
						Verify Email
					</button>
				</form>
			</div>
		</div>
	);
};

export default EmailVerificationPage;
