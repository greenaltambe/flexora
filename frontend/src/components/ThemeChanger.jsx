import { useState } from "react";
import { Palette } from "lucide-react";

const ThemeChanger = () => {
	const [isOpen, setIsOpen] = useState(false);

	const themes = [
		{ name: "light", label: "Light" },
		{ name: "dark", label: "Dark" },
		{ name: "cupcake", label: "Cupcake" },
		{ name: "bumblebee", label: "Bumblebee" },
		{ name: "emerald", label: "Emerald" },
		{ name: "corporate", label: "Corporate" },
		{ name: "synthwave", label: "Synthwave" },
		{ name: "retro", label: "Retro" },
		{ name: "cyberpunk", label: "Cyberpunk" },
		{ name: "valentine", label: "Valentine" },
		{ name: "halloween", label: "Halloween" },
		{ name: "garden", label: "Garden" },
		{ name: "forest", label: "Forest" },
		{ name: "aqua", label: "Aqua" },
		{ name: "lofi", label: "Lofi" },
		{ name: "pastel", label: "Pastel" },
		{ name: "fantasy", label: "Fantasy" },
		{ name: "wireframe", label: "Wireframe" },
		{ name: "black", label: "Black" },
		{ name: "luxury", label: "Luxury" },
		{ name: "dracula", label: "Dracula" },
		{ name: "cmyk", label: "CMYK" },
		{ name: "autumn", label: "Autumn" },
		{ name: "business", label: "Business" },
		{ name: "acid", label: "Acid" },
		{ name: "lemonade", label: "Lemonade" },
		{ name: "night", label: "Night" },
		{ name: "coffee", label: "Coffee" },
		{ name: "winter", label: "Winter" },
	];

	const changeTheme = (theme) => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
		setIsOpen(false);
	};

	return (
		<div className="dropdown dropdown-end">
			<div
				tabIndex={0}
				role="button"
				className="btn btn-ghost btn-circle"
				onClick={() => setIsOpen(!isOpen)}
			>
				<Palette className="w-5 h-5" />
			</div>
			{isOpen && (
				<div
					tabIndex={0}
					className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto"
					onBlur={() => setIsOpen(false)}
				>
					<div className="menu-title text-xs text-base-content/70 mb-2">
						Choose Theme
					</div>
					{themes.map((theme) => (
						<button
							key={theme.name}
							className="btn btn-sm btn-ghost justify-start text-left"
							onClick={() => changeTheme(theme.name)}
						>
							{theme.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default ThemeChanger;
