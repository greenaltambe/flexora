import Input from "../components/Input";
import { MailIcon, LockKeyholeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
	const handleLogin = (e) => {
		e.preventDefault();
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
					/>
					<Input
						icon={LockKeyholeIcon}
						type="password"
						name="password"
						placeholder="Password"
					/>
					<button className="btn btn-primary w-full mt-2">
						Login
					</button>
				</form>
				<p className="text-center mt-2">
					Don't have an account?{" "}
					<Link to="/register" className="link link-primary">
						Register
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
