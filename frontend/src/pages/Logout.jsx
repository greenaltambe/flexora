import { useAuthStore } from "../store/auth/authStore";

const Logout = () => {
	const { logout } = useAuthStore();
	return (
		<div>
			<button className="btn btn-ghost" onClick={logout}>
				Logout
			</button>
		</div>
	);
};

export default Logout;
