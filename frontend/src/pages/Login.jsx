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
			navigate("/");
		} catch (err) {
			console.error(err);
			toast.error(err || "Something went wrong. Try again!");
		}
	};

	return (
		<div className="card bg-base-100 w-96 shadow-sm">
			<div className="card-body">
				<h2 className="card-title text-center">Login</h2>
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
						className="btn btn-primary w-full mt-2"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? <Loader /> : "Login"}
					</button>
				</form>
				<p className="text-center mt-2">
					Don't have an account?{" "}
					<Link to="/register" className="link link-primary">
						Register
					</Link>
				</p>
			</div>
			{error && (
				<div className="alert alert-error mt-3 justify-center">
					<span>{error}</span>
				</div>
			)}
		</div>
	);
};

export default Login;
