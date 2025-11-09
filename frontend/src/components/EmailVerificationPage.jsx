import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { MailIcon } from "lucide-react";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();
	const { verifyEmail, user, isLoading, error } = useAuthStore();

	// small debounce timer id used for auto-submit after last input
	const autoSubmitTimer = useRef(null);

	const handleSubmit = async (e) => {
		if (e && e.preventDefault) e.preventDefault();

		// defensive checks
		if (!user?.email) {
			toast.error(
				"No email found to verify. Please login or re-register."
			);
			return { success: false, message: "Missing user email" };
		}

		const verificationCode = code.join("");
		if (verificationCode.length !== 6) {
			toast.error("Please enter the 6-digit code.");
			return { success: false, message: "Code incomplete" };
		}

		try {
			const result = await verifyEmail({
				email: user.email,
				verificationCode,
			});

			// If your store uses the explicit-return contract:
			// { success: true/false, message? }
			if (!result || result.success === false) {
				const msg =
					result?.message ||
					result?.error ||
					error ||
					"Verification failed";
				toast.error(msg);
				return { success: false, message: msg };
			}

			toast.success("Email verified successfully!");
			navigate("/dashboard");
			return { success: true };
		} catch (err) {
			// defensive: in case store throws instead of returning
			const msg =
				err?.message || "Something went wrong during verification";
			console.error("verifyEmail threw:", err);
			toast.error(msg);
			return { success: false, message: msg };
		}
	};

	const handleKeyDown = (e, index) => {
		const key = e.key;

		// navigation keys
		if (key === "ArrowLeft" && index > 0) {
			e.preventDefault();
			inputRefs.current[index - 1]?.focus();
			return;
		}
		if (key === "ArrowRight" && index < 5) {
			e.preventDefault();
			inputRefs.current[index + 1]?.focus();
			return;
		}

		if (key === "Backspace") {
			// If current cell empty -> move left; otherwise clear current
			if (code[index] === "" && index > 0) {
				e.preventDefault();
				const newCode = [...code];
				newCode[index - 1] = "";
				setCode(newCode);
				inputRefs.current[index - 1]?.focus();
			} else {
				// Let the onChange handle clearing the char when there is one
				const newCode = [...code];
				newCode[index] = "";
				setCode(newCode);
			}
			return;
		}

		// Submit on Enter
		if (key === "Enter") {
			e.preventDefault();
			handleSubmit();
			return;
		}

		// Prevent non-alphanumeric single characters (we allow digits/letters)
		if (key.length === 1 && !/^[0-9a-zA-Z]$/.test(key)) {
			e.preventDefault();
		}
	};

	const handleCodeChange = (e, index) => {
		const value = e.target.value;
		const newCode = [...code];

		// If user pasted multiple characters into one box, handle paste across inputs
		if (value.length > 1) {
			const pasted = value.slice(0, 6 - index).split("");
			for (let i = 0; i < pasted.length; i++) {
				newCode[index + i] = pasted[i];
			}
			setCode(newCode);
			const nextIndex = Math.min(index + pasted.length, 5);
			// focus the cell after the last pasted char (or last cell)
			// small timeout so DOM has updated
			setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
			return;
		}

		// typical single-character input
		const char = value.slice(-1);
		newCode[index] = char;
		setCode(newCode);

		// auto-move to next if char exists
		if (char && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	// Handle paste on any input (ensures paste also works if placed into the first input)
	const handlePaste = (e, index) => {
		e.preventDefault();
		const paste = (e.clipboardData || window.clipboardData).getData("text");
		if (!paste) return;

		// only keep first 6 alnum chars
		const filtered = paste.replace(/[^0-9a-zA-Z]/g, "").slice(0, 6);
		if (!filtered) return;

		const newCode = [...code];
		for (let i = 0; i < filtered.length; i++) {
			if (index + i > 5) break;
			newCode[index + i] = filtered[i];
		}
		setCode(newCode);

		// focus next after pasted segment
		const nextIndex = Math.min(index + filtered.length, 5);
		setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
	};

	// Auto-submit when all digits filled, with a tiny debounce to avoid race conditions
	useEffect(() => {
		// clear previous timer
		if (autoSubmitTimer.current) {
			clearTimeout(autoSubmitTimer.current);
			autoSubmitTimer.current = null;
		}

		if (code.every((v) => v !== "")) {
			// wait 250ms: gives paste/autofill/browser time, avoids double-calls
			autoSubmitTimer.current = setTimeout(() => {
				handleSubmit();
				autoSubmitTimer.current = null;
			}, 250);
		}

		return () => {
			if (autoSubmitTimer.current) {
				clearTimeout(autoSubmitTimer.current);
				autoSubmitTimer.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [code]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body">
					<div className="text-center mb-6">
						<div className="badge badge-accent badge-lg p-3 mb-4">
							<MailIcon className="w-6 h-6" />
						</div>
						<h2 className="text-3xl font-bold">
							Verify Your Email
						</h2>
						<p className="text-base-content/70 mt-2">
							Enter the 6-digit verification code sent to your
							email.
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className="mt-4"
						autoComplete="one-time-code"
					>
						<div className="join w-full justify-between mb-6">
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
									onPaste={(e) => handlePaste(e, idx)}
									aria-label={`Verification digit ${idx + 1}`}
									disabled={isLoading}
									autoFocus={idx === 0}
								/>
							))}
						</div>

						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isLoading}
						>
							{isLoading ? <Loader /> : "Verify Email"}
						</button>
					</form>

					{error && (
						<div className="alert alert-error mt-4">
							<span>{error}</span>
						</div>
					)}

					<div className="divider">Need help?</div>
					<p className="text-center text-sm text-base-content/70">
						Didn't receive the code? Check your spam folder or{" "}
						<button className="link link-primary">
							resend code
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default EmailVerificationPage;
