import Input from "../components/Input";
import { MailIcon, LockKeyholeIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import { useState } from "react";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isLoading, error } = useAuthStore();
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		const formData = {
			email,
			password,
		};
		try {
			const { success, message } = await login(formData);
			if (!success) {
				toast.error(message);
				return;
			}
			toast.success("Login successful!");
			navigate((useAuthStore.getState().user?.role === "admin") ? "/admin" : "/dashboard");
		} catch (err) {
			console.error(err);
			toast.error(err || "Something went wrong. Try again!");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
			<div className="card bg-base-100 w-full max-w-md shadow-xl">
				<div className="card-body">
					<div className="text-center mb-6">
						<div className="badge badge-primary badge-lg p-3 mb-4">
							<MailIcon className="w-6 h-6" />
						</div>
						<h2 className="text-3xl font-bold">Welcome Back</h2>
						<p className="text-base-content/70 mt-2">Sign in to your Flexora account</p>
					</div>
					<form onSubmit={handleLogin} className="space-y-4">
						<Input
							icon={MailIcon}
							type="email"
							name="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							icon={LockKeyholeIcon}
							type="password"
							name="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							className="btn btn-primary w-full mt-6"
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? <Loader /> : "Sign In"}
						</button>
					</form>
					{error && (
						<div className="alert alert-error mt-4">
							<span>{error}</span>
						</div>
					)}
					<div className="text-center mt-4">
						<Link to="/forgot-password" className="link link-primary text-sm">
							Forgot your password?
						</Link>
					</div>
					<div className="divider">OR</div>
					<p className="text-center">
						Don't have an account?{" "}
						<Link to="/register" className="link link-primary font-medium">
							Create one here
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
