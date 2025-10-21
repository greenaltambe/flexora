import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./pages/Layout";
import EmailVerificationPage from "./components/EmailVerificationPage";
import { Toaster } from "react-hot-toast";

const App = () => {
	return (
		<Layout>
			<div className="join join-vertical">
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Default"
					value="default"
				/>
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Retro"
					value="retro"
				/>
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Cyberpunk"
					value="cyberpunk"
				/>
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Valentine"
					value="valentine"
				/>
				<input
					type="radio"
					name="theme-buttons"
					className="btn theme-controller join-item"
					aria-label="Aqua"
					value="aqua"
				/>
			</div>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/verify-email"
					element={<EmailVerificationPage />}
				/>
			</Routes>
			<Toaster position="top-center" />
		</Layout>
	);
};

export default App;
