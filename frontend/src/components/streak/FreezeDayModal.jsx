import { X, Snowflake, Calendar } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * FreezeDayModal Component
 *
 * Modal for requesting freeze days to preserve streak.
 * Users can select a date and provide a reason for the freeze.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} props.onSubmit - Submit freeze day request (date, reason)
 * @param {number} props.availableFreezes - Number of freezes remaining
 */
const FreezeDayModal = ({
	isOpen,
	onClose,
	onSubmit,
	availableFreezes = 0,
}) => {
	const [date, setDate] = useState("");
	const [reason, setReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!date) {
			toast.error("Please select a date");
			return;
		}

		if (!reason.trim()) {
			toast.error("Please provide a reason");
			return;
		}

		if (availableFreezes <= 0) {
			toast.error("No freeze days available");
			return;
		}

		setIsSubmitting(true);
		try {
			await onSubmit(date, reason.trim());
			toast.success("Freeze day requested successfully! ❄️");
			handleClose();
		} catch (error) {
			toast.error(error.message || "Failed to request freeze day");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		if (!isSubmitting) {
			setDate("");
			setReason("");
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 z-40"
				onClick={handleClose}
			></div>

			{/* Modal */}
			<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
				<div className="card bg-base-100 w-full max-w-md shadow-xl">
					<div className="card-body">
						{/* Header */}
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<Snowflake className="w-6 h-6 text-info" />
								<h2 className="card-title">
									Request Freeze Day
								</h2>
							</div>
							<button
								onClick={handleClose}
								disabled={isSubmitting}
								className="btn btn-ghost btn-sm btn-circle"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Available Freezes */}
						<div className="alert alert-info mb-4">
							<Snowflake className="w-5 h-5" />
							<div>
								<p className="font-semibold">
									{availableFreezes} freeze{" "}
									{availableFreezes === 1 ? "day" : "days"}{" "}
									available
								</p>
								<p className="text-sm">
									Freeze days protect your streak when you
									can't workout
								</p>
							</div>
						</div>

						{availableFreezes <= 0 ? (
							<div className="alert alert-warning">
								<p>
									You don't have any freeze days available.
									Keep working out to earn more!
								</p>
							</div>
						) : (
							<form onSubmit={handleSubmit}>
								{/* Date Picker */}
								<div className="form-control mb-4">
									<label className="label">
										<span className="label-text font-semibold">
											Select Date
										</span>
									</label>
									<div className="relative">
										<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
										<input
											type="date"
											value={date}
											onChange={(e) =>
												setDate(e.target.value)
											}
											max={
												new Date()
													.toISOString()
													.split("T")[0]
											}
											className="input input-bordered w-full pl-10"
											disabled={isSubmitting}
											required
										/>
									</div>
									<label className="label">
										<span className="label-text-alt text-base-content/70">
											You can only freeze past or current
											days
										</span>
									</label>
								</div>

								{/* Reason Textarea */}
								<div className="form-control mb-6">
									<label className="label">
										<span className="label-text font-semibold">
											Reason (optional but encouraged)
										</span>
									</label>
									<textarea
										value={reason}
										onChange={(e) =>
											setReason(e.target.value)
										}
										placeholder="E.g., Sick, injured, rest day, travel..."
										className="textarea textarea-bordered h-24"
										disabled={isSubmitting}
										maxLength={200}
									/>
									<label className="label">
										<span className="label-text-alt"></span>
										<span className="label-text-alt">
											{reason.length}/200
										</span>
									</label>
								</div>

								{/* Actions */}
								<div className="flex gap-2 justify-end">
									<button
										type="button"
										onClick={handleClose}
										disabled={isSubmitting}
										className="btn btn-ghost"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={
											isSubmitting ||
											availableFreezes <= 0
										}
										className="btn btn-primary"
									>
										{isSubmitting ? (
											<>
												<span className="loading loading-spinner loading-sm"></span>
												Requesting...
											</>
										) : (
											<>
												<Snowflake className="w-4 h-4" />
												Request Freeze
											</>
										)}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default FreezeDayModal;
