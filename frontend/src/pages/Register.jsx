import { useState } from "react";
import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { UserIcon, MailIcon, LockKeyholeIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Register = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { register, isLoading, error } = useAuthStore();
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		const formData = {
			firstName,
			lastName,
			email,
			password,
		};
		try {
			const { success, message } = await register(formData);
			if (!success) {
				toast.error(message);
				return;
			}
			toast.success("Registration successful!");
			navigate("/verify-email");
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
						<div className="badge badge-secondary badge-lg p-3 mb-4">
							<UserIcon className="w-6 h-6" />
						</div>
						<h2 className="text-3xl font-bold">Join Flexora</h2>
						<p className="text-base-content/70 mt-2">Start your fitness journey today</p>
					</div>
					<form onSubmit={handleRegister}>
						<div className="space-y-4">
							<Input
								icon={UserIcon}
								type="text"
								name="firstName"
								placeholder="First Name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
							<Input
								icon={UserIcon}
								type="text"
								name="lastName"
								placeholder="Last Name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
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
							<PasswordStrengthMeter password={password} />
						</div>
						<button
							className={`btn btn-primary w-full mt-6`}
							disabled={isLoading}
						>
							{isLoading ? <Loader /> : "Create Account"}
						</button>
					</form>

					{error && (
						<div className="alert alert-error mt-4">
							<span>{error}</span>
						</div>
					)}

					<div className="divider">OR</div>
					<p className="text-center">
						Already have an account?{" "}
						<Link to="/login" className="link link-primary font-medium">
							Sign in here
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
