import { useState } from "react";
import { useNavigate } from "react-router-dom";
import exerciseStore from "../store/exercise/exerciseStore";
import toast from "react-hot-toast";
import { ArrowLeft, Upload, FileText, AlertCircle, Download } from "lucide-react";

const ImportExerciseCSV = () => {
	const navigate = useNavigate();
	const { bulkCreateExercises } = exerciseStore();
	const [isLoading, setIsLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState([]);
	const [csvContent, setCsvContent] = useState("");

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			// Check file extension instead of MIME type (more reliable across browsers)
			const fileName = selectedFile.name.toLowerCase();
			if (!fileName.endsWith('.csv')) {
				toast.error("Please select a CSV file (.csv extension)");
				return;
			}
			setFile(selectedFile);
			parseCSV(selectedFile);
		}
	};

	const parseCSV = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target.result;
			setCsvContent(content);
			const lines = content.split("\n").filter((line) => line.trim());
			if (lines.length < 2) {
				toast.error("CSV file must have at least a header and one data row");
				return;
			}

			// Improved CSV parsing function to handle quoted fields
			const parseCSVLine = (line) => {
				const result = [];
				let current = "";
				let inQuotes = false;

				for (let i = 0; i < line.length; i++) {
					const char = line[i];
					if (char === '"') {
						inQuotes = !inQuotes;
					} else if (char === "," && !inQuotes) {
						result.push(current.trim());
						current = "";
					} else {
						current += char;
					}
				}
				result.push(current.trim());
				return result;
			};

			const headers = parseCSVLine(lines[0]);
			const previewData = lines.slice(1, 6).map((line) => {
				const values = parseCSVLine(line);
				return headers.reduce((acc, header, index) => {
					acc[header] = values[index] || "";
					return acc;
				}, {});
			});
			setPreview(previewData);
		};
		reader.readAsText(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			toast.error("Please select a CSV file");
			return;
		}

		setIsLoading(true);
		const result = await bulkCreateExercises(csvContent);
		setIsLoading(false);

		if (result.success) {
			// Show success message with details
			let successMessage = result.message || "Exercises imported successfully";
			
			// Show skipped items if any
			if (result.data?.skipped && result.data.skipped.length > 0) {
				const skippedList = result.data.skipped.map(e => `${e.name}`).join(', ');
				successMessage += `\nSkipped (duplicates): ${skippedList}`;
			}
			
			toast.success(successMessage);
			navigate("/admin/manage-exercise");
		} else {
			// Show detailed error message
			let errorMessage = result.message || "Failed to import exercises";
			
			// If there are error details, show them
			const errorDetails = result.details || result.errors || [];
			if (errorDetails.length > 0) {
				const errorList = errorDetails.map(e => `Row ${e.row}: ${e.message}`).join(', ');
				errorMessage += `\nErrors: ${errorList}`;
			}
			
			toast.error(errorMessage);
		}
	};

	const handleReset = () => {
		setFile(null);
		setPreview([]);
		setCsvContent("");
	};

	return (
		<div className="min-h-screen bg-base-100 p-6">
			<div className="container mx-auto max-w-4xl">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-base-content">
						Import Exercises from CSV
					</h1>
					<button
						type="button"
						onClick={() => navigate("/admin/manage-exercise")}
						className="btn btn-ghost gap-2"
					>
						<ArrowLeft className="w-5 h-5" />
						Back to Exercises
					</button>
				</div>

				<div className="card bg-base-100 shadow-lg border border-base-200">
					<div className="card-body p-8">
						{/* Instructions */}
						<div className="alert alert-info mb-6">
							<div>
								<AlertCircle className="w-6 h-6" />
								<div className="ml-4">
									<h3 className="font-bold">CSV Format Instructions</h3>
									<div className="text-sm mt-2">
										<p>Your CSV file should include the following columns:</p>
										<ul className="list-disc list-inside mt-2 space-y-1">
											<li>
												<strong>name</strong> (required) - Exercise name
											</li>
											<li>
												<strong>description</strong> - Exercise description
											</li>
											<li>
												<strong>type</strong> - strength, cardio, mobility,
												skill, or hybrid
											</li>
											<li>
												<strong>primary_muscles</strong> - Comma-separated
												muscles
											</li>
											<li>
												<strong>secondary_muscles</strong> - Comma-separated
												muscles
											</li>
											<li>
												<strong>equipment</strong> - Comma-separated equipment
											</li>
											<li>
												<strong>tags</strong> - Comma-separated tags
											</li>
											<li>
												<strong>difficulty</strong> - 1-5
											</li>
											<li>
												<strong>modality</strong> - reps, time, distance,
												interval, or rpm
											</li>
											<li>
												<strong>sets</strong> - Number of sets
											</li>
											<li>
												<strong>reps</strong> - Number of reps
											</li>
											<li>
												<strong>rest_seconds</strong> - Rest time in seconds
											</li>
											<li>
												<strong>estimated_minutes</strong> - Estimated duration
											</li>
											<li>
												<strong>published</strong> - true or false
											</li>
										</ul>
										<div className="mt-4">
											<a
												href="/sample-exercises.csv"
												download
												className="btn btn-sm btn-outline btn-primary gap-2"
											>
												<Download className="w-4 h-4" />
												Download Sample CSV
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6">
							{/* File Upload */}
							<div className="form-control space-y-2">
								<label className="label">
									<span className="label-text font-medium text-base-content">
										Select CSV File{" "}
										<span className="text-error">*</span>
									</span>
								</label>
								<div className="flex gap-3">
									<input
										type="file"
										accept=".csv"
										onChange={handleFileChange}
										className="file-input file-input-bordered file-input-primary w-full"
										disabled={isLoading}
									/>
									{file && (
										<button
											type="button"
											onClick={handleReset}
											className="btn btn-outline btn-neutral"
											disabled={isLoading}
										>
											Reset
										</button>
									)}
								</div>
								{file && (
									<div className="text-sm text-base-content/70 mt-2">
										<FileText className="w-4 h-4 inline mr-2" />
										{file.name}
									</div>
								)}
							</div>

							{/* Preview */}
							{preview.length > 0 && (
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-base-content">
										Preview ({preview.length} rows)
									</h3>
									<div className="overflow-x-auto">
										<table className="table table-zebra w-full">
											<thead>
												<tr>
													{Object.keys(preview[0]).map((key) => (
														<th key={key}>{key}</th>
													))}
												</tr>
											</thead>
											<tbody>
												{preview.map((row, index) => (
													<tr key={index}>
														{Object.values(row).map((value, vIndex) => (
															<td key={vIndex} className="max-w-xs truncate">
																{String(value)}
															</td>
														))}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)}

							{/* Submit Button */}
							<div className="flex justify-end gap-4">
								<button
									type="button"
									onClick={() => navigate("/admin/manage-exercise")}
									className="btn btn-outline btn-neutral btn-md"
									disabled={isLoading}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-primary btn-md gap-2"
									disabled={isLoading || !file}
								>
									{isLoading ? (
										<span className="loading loading-spinner text-base-content"></span>
									) : (
										<>
											<Upload className="w-5 h-5" />
											Import Exercises
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImportExerciseCSV;
