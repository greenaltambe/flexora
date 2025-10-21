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
			console.log(formData);
			await register(formData);
			toast.success("Registration successful!");
			navigate("/");
		} catch (err) {
			console.error(err);
			toast.error(error || "Something went wrong. Try again!");
		}
	};

	return (
		<div className="card bg-base-100 w-96 shadow-sm">
			<div className="card-body">
				<h2 className="card-title text-center">Register</h2>
				<form onSubmit={handleRegister}>
					<Input
						icon={UserIcon}
						type="text"
						name="firstName"
						placeholder="First Name"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
					<br />
					<Input
						icon={UserIcon}
						type="text"
						name="lastName"
						placeholder="Last Name"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					/>
					<br />
					<Input
						icon={MailIcon}
						type="email"
						name="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<br />
					<Input
						icon={LockKeyholeIcon}
						type="password"
						name="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<PasswordStrengthMeter password={password} />
					<br />
					<button
						className={`btn btn-primary w-full mt-2`}
						disabled={isLoading}
					>
						{isLoading ? <Loader /> : "Register"}
					</button>
				</form>

				{error && (
					<div className="alert alert-error mt-3 justify-center">
						<span>{error}</span>
					</div>
				)}

				<p className="text-center mt-2">
					Already have an account?{" "}
					<Link to="/login" className="link link-primary">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
