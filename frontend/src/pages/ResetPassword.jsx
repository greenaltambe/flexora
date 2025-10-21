import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import { LockKeyholeIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const { token } = useParams();
	const navigate = useNavigate();
	const { resetPassword, isLoading } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { success, message } = await resetPassword({ token, password });
		if (!success) return toast.error(message);
		toast.success("Password reset successfully");
		navigate("/dashboard");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
			<div className="card bg-base-100 w-full max-w-md shadow-xl">
				<div className="card-body">
					<div className="text-center mb-6">
						<div className="badge badge-secondary badge-lg p-3 mb-4">
							<LockKeyholeIcon className="w-6 h-6" />
						</div>
						<h2 className="text-3xl font-bold">Reset Password</h2>
						<p className="text-base-content/70 mt-2">Enter your new password</p>
					</div>
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							type="password"
							className="input input-bordered w-full"
							placeholder="New password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={6}
						/>
						<button className="btn btn-primary w-full" disabled={isLoading}>
							{isLoading ? "Resetting..." : "Reset Password"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;


