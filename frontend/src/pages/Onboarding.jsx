import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import OnboardingForm from "../components/OnboardingForm";
import Loader from "../components/Loader";

const Onboarding = () => {
	const { user, isCheckingAuth, checkAuth } = useAuthStore();
	const navigate = useNavigate();

	// Remove the redirect logic to allow editing even after completion

	if (isCheckingAuth) {
		return <Loader />;
	}

	// Allow editing even if onboarding is completed

	return (
		<div className="min-h-screen bg-base-200 p-4">
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold mb-4 text-center">
					{user?.onboardingCompleted ? "Update Your Profile" : "Welcome to Flexora! 🎉"}
				</h1>
				<p className="text-center text-base-content/70 mb-8">
					{user?.onboardingCompleted 
						? "Update your fitness profile information" 
						: "Let's set up your fitness profile to get started"
					}
				</p>
				<OnboardingForm
					user={user}
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

