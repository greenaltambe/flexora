import { Link } from "react-router-dom";
import { Dumbbell, Target, Users, TrendingUp, CheckCircle, Star } from "lucide-react";

const LandingPage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
			{/* Hero Section */}
			<section className="hero min-h-screen bg-base-100">
				<div className="hero-content text-center">
					<div className="max-w-md">
						<div className="flex justify-center mb-6">
							<div className="badge badge-primary badge-lg p-4">
								<Dumbbell className="w-8 h-8" />
							</div>
						</div>
						<h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							Flexora
						</h1>
						<p className="py-6 text-lg">
							Transform your fitness journey with personalized workout plans designed just for you. 
							Track progress, stay motivated, and achieve your goals with Flexora.
						</p>
						<div className="flex gap-4 justify-center">
							<Link to="/register" className="btn btn-primary btn-lg">
								Get Started
							</Link>
							<Link to="/login" className="btn btn-outline btn-lg">
								Sign In
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-base-100">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">Why Choose Flexora?</h2>
						<p className="text-xl text-base-content/70 max-w-2xl mx-auto">
							Our comprehensive fitness platform provides everything you need to succeed in your fitness journey.
						</p>
					</div>
					
					<div className="grid md:grid-cols-3 gap-8">
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body text-center">
								<Target className="w-12 h-12 text-primary mx-auto mb-4" />
								<h3 className="card-title justify-center mb-2">Personalized Plans</h3>
								<p className="text-base-content/70">
									Get custom workout plans tailored to your fitness level, goals, and preferences.
								</p>
							</div>
						</div>
						
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body text-center">
								<TrendingUp className="w-12 h-12 text-secondary mx-auto mb-4" />
								<h3 className="card-title justify-center mb-2">Progress Tracking</h3>
								<p className="text-base-content/70">
									Monitor your progress with detailed analytics and visual charts to stay motivated.
								</p>
							</div>
						</div>
						
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body text-center">
								<Users className="w-12 h-12 text-accent mx-auto mb-4" />
								<h3 className="card-title justify-center mb-2">Community Support</h3>
								<p className="text-base-content/70">
									Connect with like-minded fitness enthusiasts and share your achievements.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
				<div className="container mx-auto px-4">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-4xl font-bold mb-6">Achieve Your Fitness Goals</h2>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
									<div>
										<h3 className="font-semibold text-lg">Expert-Designed Workouts</h3>
										<p className="text-base-content/70">Professional trainers create all workout plans</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
									<div>
										<h3 className="font-semibold text-lg">Adaptive Difficulty</h3>
										<p className="text-base-content/70">Plans adjust as you get stronger and fitter</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
									<div>
										<h3 className="font-semibold text-lg">Flexible Scheduling</h3>
										<p className="text-base-content/70">Work out when it fits your schedule</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
									<div>
										<h3 className="font-semibold text-lg">Nutrition Guidance</h3>
										<p className="text-base-content/70">Complementary nutrition tips for better results</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex justify-center">
							<div className="stats stats-vertical shadow-2xl">
								<div className="stat">
									<div className="stat-figure text-primary">
										<Dumbbell className="w-8 h-8" />
									</div>
									<div className="stat-title">Workouts Completed</div>
									<div className="stat-value text-primary">10,000+</div>
									<div className="stat-desc">By our community</div>
								</div>
								<div className="stat">
									<div className="stat-figure text-secondary">
										<Users className="w-8 h-8" />
									</div>
									<div className="stat-title">Active Users</div>
									<div className="stat-value text-secondary">5,000+</div>
									<div className="stat-desc">Fitness enthusiasts</div>
								</div>
								<div className="stat">
									<div className="stat-figure text-accent">
										<Star className="w-8 h-8" />
									</div>
									<div className="stat-title">Success Rate</div>
									<div className="stat-value text-accent">95%</div>
									<div className="stat-desc">Goal achievement</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-primary text-primary-content">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-4xl font-bold mb-6">Ready to Start Your Fitness Journey?</h2>
					<p className="text-xl mb-8 opacity-90">
						Join thousands of users who have transformed their lives with Flexora.
					</p>
					<div className="flex gap-4 justify-center">
						<Link to="/register" className="btn btn-secondary btn-lg">
							Start Free Trial
						</Link>
						<Link to="/login" className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
							Sign In
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
