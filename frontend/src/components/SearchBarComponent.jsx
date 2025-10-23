import { useState } from "react";

const SearchBarComponent = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		onSearch(e.target.value);
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
