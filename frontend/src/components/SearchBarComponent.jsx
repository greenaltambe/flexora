import { useState } from "react";
import { Search } from "lucide-react";

const SearchBarComponent = ({ onSearch, onApply }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		onSearch(value);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			onApply();
		}
	};

	return (
		<div className="form-control">
			<div className="input-group join">
				<input
					type="text"
					placeholder="Search exercises..."
					className="input input-bordered join-item"
					value={searchTerm}
					onChange={handleSearch}
					onKeyPress={handleKeyPress}
				/>
				<button
					type="button"
					onClick={onApply}
					className="btn btn-primary join-item"
				>
					<Search className="w-4 h-4" />
					Search
				</button>
			</div>
		</div>
	);
};

export default SearchBarComponent;
