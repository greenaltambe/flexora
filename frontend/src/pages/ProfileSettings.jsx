import { useEffect, useState } from "react";
import { ArrowLeft, User, Target, Lock, Save, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfileStore } from "../store/profile/profileStore";
import { useAuthStore } from "../store/auth/authStore";
import PageContainer from "../components/PageContainer";
import toast from "react-hot-toast";

const ProfileSettings = () => {
	const { profile, isLoading, getProfile, updateProfile } = useProfileStore();
	const { user } = useAuthStore();

	const [activeTab, setActiveTab] = useState("personal");
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		age: "",
		gender: "",
		height: "",
		weight: "",
		fitnessGoals: "",
		experienceLevel: "",
		healthConditions: "",
	});
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		getProfile();
	}, []);

	useEffect(() => {
		if (profile) {
			setFormData({
				firstName: profile.firstName || "",
				lastName: profile.lastName || "",
				email: user?.email || "",
				age: profile.age || "",
				gender: profile.gender || "",
				height: profile.height || "",
				weight: profile.weight || "",
				fitnessGoals: profile.fitnessGoals || "",
				experienceLevel: profile.experienceLevel || "",
				healthConditions: profile.healthConditions || "",
			});
		}
	}, [profile, user]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSaveProfile = async (e) => {
		e.preventDefault();
		setIsSaving(true);

		try {
			// Prepare update data (exclude email as it's usually not editable)
			const updateData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				age: formData.age ? parseInt(formData.age) : undefined,
				gender: formData.gender,
				height: formData.height
					? parseFloat(formData.height)
					: undefined,
				weight: formData.weight
					? parseFloat(formData.weight)
					: undefined,
				fitnessGoals: formData.fitnessGoals,
				experienceLevel: formData.experienceLevel,
				healthConditions: formData.healthConditions,
			};

			// Remove undefined values
			Object.keys(updateData).forEach(
				(key) => updateData[key] === undefined && delete updateData[key]
			);

			const result = await updateProfile(updateData);
			if (result.success) {
				toast.success("Profile updated successfully! ✨");
			} else {
				toast.error(result.message || "Failed to update profile");
			}
		} catch (error) {
			toast.error("An error occurred while updating profile");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<PageContainer>
			<div className="flex flex-col gap-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link
							to="/dashboard"
							className="btn btn-ghost btn-circle"
						>
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div>
							<h1 className="text-3xl font-bold">
								Profile Settings
							</h1>
							<p className="text-base-content/70">
								Manage your personal information and preferences
							</p>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="tabs tabs-boxed bg-base-200 p-1">
					<button
						className={`tab ${
							activeTab === "personal" ? "tab-active" : ""
						}`}
						onClick={() => setActiveTab("personal")}
					>
						<User className="w-4 h-4 mr-2" />
						Personal Info
					</button>
					<button
						className={`tab ${
							activeTab === "fitness" ? "tab-active" : ""
						}`}
						onClick={() => setActiveTab("fitness")}
					>
						<Target className="w-4 h-4 mr-2" />
						Fitness Goals
					</button>
					<button
						className={`tab ${
							activeTab === "account" ? "tab-active" : ""
						}`}
						onClick={() => setActiveTab("account")}
					>
						<Lock className="w-4 h-4 mr-2" />
						Account
					</button>
				</div>

				{/* Tab Content */}
				<form onSubmit={handleSaveProfile}>
					{activeTab === "personal" && (
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h2 className="card-title mb-2 flex items-center gap-2">
									<span>👤</span> Personal Information
								</h2>
								<p className="text-sm text-base-content/70 mb-6">
									Your basic personal details and physical
									measurements
								</p>

								{isLoading ? (
									<div className="space-y-4">
										<div className="skeleton h-12 w-full"></div>
										<div className="skeleton h-12 w-full"></div>
										<div className="skeleton h-12 w-full"></div>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* First Name */}
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold">
													First Name
												</span>
											</label>
											<input
												type="text"
												name="firstName"
												value={formData.firstName}
												onChange={handleInputChange}
												className="input input-bordered"
												placeholder="Enter your first name"
											/>
										</div>

										{/* Last Name */}
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold">
													Last Name
												</span>
											</label>
											<input
												type="text"
												name="lastName"
												value={formData.lastName}
												onChange={handleInputChange}
												className="input input-bordered"
												placeholder="Enter your last name"
											/>
										</div>

										{/* Age */}
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold">
													Age
												</span>
											</label>
											<input
												type="number"
												name="age"
												value={formData.age}
												onChange={handleInputChange}
												className="input input-bordered"
												placeholder="Enter your age"
												min="13"
												max="120"
											/>
										</div>

										{/* Gender */}
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold">
													Gender
												</span>
											</label>
											<select
												name="gender"
												value={formData.gender}
												onChange={handleInputChange}
												className="select select-bordered"
											>
												<option value="">
													Select gender
												</option>
												<option value="male">
													Male
												</option>
												<option value="female">
													Female
												</option>
												<option value="other">
													Other
												</option>
												<option value="prefer_not_to_say">
													Prefer not to say
												</option>
											</select>
										</div>

										{/* Height */}
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold">
													Height (cm)
												</span>
											</label>
											<input
												type="number"
												name="height"
												value={formData.height}
												onChange={handleInputChange}
												className="input input-bordered"
												placeholder="Enter your height"
												min="50"
												max="300"
												step="0.1"
											/>
										</div>

										{/* Weight */}
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold">
													Weight (kg)
												</span>
											</label>
											<input
												type="number"
												name="weight"
												value={formData.weight}
												onChange={handleInputChange}
												className="input input-bordered"
												placeholder="Enter your weight"
												min="20"
												max="500"
												step="0.1"
											/>
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{activeTab === "fitness" && (
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h2 className="card-title mb-2 flex items-center gap-2">
									<span>🎯</span> Fitness Goals & Experience
								</h2>
								<p className="text-sm text-base-content/70 mb-6">
									Tell us about your fitness journey and what
									you want to achieve
								</p>

								{isLoading ? (
									<div className="space-y-4">
										<div className="skeleton h-12 w-full"></div>
										<div className="skeleton h-32 w-full"></div>
									</div>
								) : (
									<div className="space-y-6">
										{/* Experience Level */}
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold">
													Experience Level
												</span>
											</label>
											<select
												name="experienceLevel"
												value={formData.experienceLevel}
												onChange={handleInputChange}
												className="select select-bordered w-full"
											>
												<option value="">
													Select experience level
												</option>
												<option value="beginner">
													Beginner - New to fitness
												</option>
												<option value="intermediate">
													Intermediate - 1-3 years
													experience
												</option>
												<option value="advanced">
													Advanced - 3+ years
													experience
												</option>
											</select>
											<label className="label">
												<span className="label-text-alt text-base-content/70">
													This helps us tailor
													workouts to your level
												</span>
											</label>
										</div>

										{/* Fitness Goals - Checkboxes */}
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold">
													Fitness Goals
												</span>
											</label>
											<p className="text-sm text-base-content/70 mb-3">
												Select all that apply
											</p>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
												{[
													{
														value: "hypertrophy",
														label: "Muscle Gain",
														icon: "💪",
													},
													{
														value: "fat_loss",
														label: "Weight Loss",
														icon: "🔥",
													},
													{
														value: "endurance",
														label: "Improve Endurance",
														icon: "🏃",
													},
													{
														value: "strength",
														label: "Build Strength",
														icon: "🏋️",
													},
													{
														value: "flexibility",
														label: "Increase Flexibility",
														icon: "🧘",
													},
													{
														value: "general_fitness",
														label: "General Fitness",
														icon: "✨",
													},
												].map((goal) => {
													const goalsArray =
														formData.fitnessGoals
															? formData.fitnessGoals
																	.split(",")
																	.map((g) =>
																		g.trim()
																	)
																	.filter(
																		Boolean
																	)
															: [];
													const isChecked =
														goalsArray.includes(
															goal.value
														);

													return (
														<label
															key={goal.value}
															className="label cursor-pointer justify-start gap-3 bg-base-200 rounded-lg p-4 hover:bg-base-300 transition-colors"
														>
															<input
																type="checkbox"
																className="checkbox checkbox-primary"
																checked={
																	isChecked
																}
																onChange={(
																	e
																) => {
																	const currentGoals =
																		formData.fitnessGoals
																			? formData.fitnessGoals
																					.split(
																						","
																					)
																					.map(
																						(
																							g
																						) =>
																							g.trim()
																					)
																					.filter(
																						Boolean
																					)
																			: [];

																	const newGoals =
																		e.target
																			.checked
																			? [
																					...currentGoals,
																					goal.value,
																			  ]
																			: currentGoals.filter(
																					(
																						g
																					) =>
																						g !==
																						goal.value
																			  );

																	setFormData(
																		(
																			prev
																		) => ({
																			...prev,
																			fitnessGoals:
																				newGoals.join(
																					", "
																				),
																		})
																	);
																}}
															/>
															<span className="flex items-center gap-2">
																<span className="text-2xl">
																	{goal.icon}
																</span>
																<span className="label-text font-medium">
																	{goal.label}
																</span>
															</span>
														</label>
													);
												})}
											</div>
										</div>

										{/* Health Conditions */}
										<div className="form-control">
											<label className="label">
												<span className="label-text font-semibold">
													Health Conditions or
													Injuries (Optional)
												</span>
											</label>
											<textarea
												name="healthConditions"
												value={
													formData.healthConditions
												}
												onChange={handleInputChange}
												className="textarea textarea-bordered h-24"
												placeholder="Any injuries, medical conditions, or limitations we should know about..."
											/>
											<label className="label">
												<span className="label-text-alt text-base-content/70">
													This information helps us
													create safer workouts for
													you
												</span>
											</label>
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{activeTab === "account" && (
						<div className="card bg-base-100 shadow-lg">
							<div className="card-body">
								<h2 className="card-title mb-2 flex items-center gap-2">
									<span>🔒</span> Account Settings
								</h2>
								<p className="text-sm text-base-content/70 mb-6">
									Manage your email and password settings
								</p>

								<div className="space-y-4">
									{/* Email (Read-only) */}
									<div className="form-control">
										<label className="label">
											<span className="label-text font-semibold">
												Email Address
											</span>
										</label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
											<input
												type="email"
												value={formData.email}
												className="input input-bordered w-full pl-10"
												disabled
											/>
										</div>
										<label className="label">
											<span className="label-text-alt text-base-content/70">
												Email cannot be changed. Contact
												support if needed.
											</span>
										</label>
									</div>

									{/* Password Change Link */}
									<div className="alert alert-info">
										<Lock className="w-5 h-5" />
										<div>
											<p className="font-semibold">
												Change Password
											</p>
											<p className="text-sm">
												To change your password, use the
												"Forgot Password" link on the
												login page.
											</p>
										</div>
									</div>

									{/* Account Status */}
									<div className="card bg-base-200">
										<div className="card-body">
											<h3 className="font-semibold mb-2">
												Account Status
											</h3>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span>Account Type:</span>
													<span className="font-semibold">
														{user?.isAdmin
															? "Administrator"
															: "Standard User"}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Onboarding:</span>
													<span
														className={`badge ${
															user?.onboardingCompleted
																? "badge-success"
																: "badge-warning"
														}`}
													>
														{user?.onboardingCompleted
															? "Completed"
															: "Incomplete"}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Member Since:</span>
													<span className="font-semibold">
														{user?.createdAt
															? new Date(
																	user.createdAt
															  ).toLocaleDateString()
															: "N/A"}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Save Button */}
					<div className="flex justify-end mt-6">
						<button
							type="submit"
							disabled={isSaving || isLoading}
							className="btn btn-primary gap-2"
						>
							{isSaving ? (
								<>
									<span className="loading loading-spinner loading-sm"></span>
									Saving...
								</>
							) : (
								<>
									<Save className="w-4 h-4" />
									Save Changes
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</PageContainer>
	);
};

export default ProfileSettings;
