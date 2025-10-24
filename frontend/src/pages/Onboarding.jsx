import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import OnboardingForm from "../components/OnboardingForm";
import Loader from "../components/Loader";

const Onboarding = () => {
	const { user, isCheckingAuth, checkAuth } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isCheckingAuth && user?.onboardingCompleted) {
			navigate("/dashboard");
		}
	}, [user, isCheckingAuth, navigate]);

	if (isCheckingAuth) {
		return <Loader />;
	}

	if (user?.onboardingCompleted) {
		return null;
	}

	return (
		<div className="min-h-screen bg-base-200 p-4">
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold mb-4 text-center">
					Welcome to Flexora! 🎉
				</h1>
				<p className="text-center text-base-content/70 mb-8">
					Let's set up your fitness profile to get started
				</p>
				<OnboardingForm
					onComplete={async () => {
						// Refresh auth state to get updated user data
						await checkAuth();
						navigate("/dashboard");
					}}
				/>
			</div>
		</div>
	);
};

export default Onboarding;

