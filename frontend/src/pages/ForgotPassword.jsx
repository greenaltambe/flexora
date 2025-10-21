import { useState } from "react";
import { useAuthStore } from "../store/auth/authStore";
import { MailIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const { forgotPassword, isLoading } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { success, message } = await forgotPassword({ email });
		if (!success) return toast.error(message);
		toast.success(message || "Reset link sent");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
			<div className="card bg-base-100 w-full max-w-md shadow-xl">
				<div className="card-body">
					<div className="text-center mb-6">
						<div className="badge badge-primary badge-lg p-3 mb-4">
							<MailIcon className="w-6 h-6" />
						</div>
						<h2 className="text-3xl font-bold">Forgot Password</h2>
						<p className="text-base-content/70 mt-2">Enter your email to receive a reset link</p>
					</div>
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							type="email"
							className="input input-bordered w-full"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<button className="btn btn-primary w-full" disabled={isLoading}>
							{isLoading ? "Sending..." : "Send Reset Link"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;


