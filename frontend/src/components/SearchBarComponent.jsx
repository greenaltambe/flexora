import { useState, useEffect } from "react";

const SearchBarComponent = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			onSearch(searchTerm);
		}, 500); // Debounce search by 500ms

		return () => clearTimeout(timer);
	}, [searchTerm, onSearch]);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	return (
		<div className="form-control mb-4">
			<input
				type="text"
				placeholder="Search exercises..."
				className="input input-bordered w-full max-w-xs"
				value={searchTerm}
				onChange={handleSearch}
			/>
		</div>
	);
};

export default SearchBarComponent;
