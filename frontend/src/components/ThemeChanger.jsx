import { Palette } from "lucide-react";

const ThemeChanger = () => {
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
	};

	return (
		<div className="dropdown dropdown-top dropdown-end">
			<div
				tabIndex={0}
				role="button"
				className="btn btn-ghost btn-circle"
			>
				<Palette className="w-5 h-5" />
			</div>

			<div
				tabIndex={0}
				className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64 max-h-96 overflow-y-auto p-2 mb-2"
			>
				{/* title spans full width */}
				<div className="menu-title text-xs text-base-content/70 mb-2 px-1">
					Choose Theme
				</div>

				{/* grid for compact layout */}
				<div className="grid grid-cols-2 gap-2">
					{themes.map((theme) => (
						// set data-theme on each button so inner bg-primary shows the theme's color
						<button
							key={theme.name}
							data-theme={theme.name}
							className="btn btn-sm btn-ghost justify-start normal-case w-full px-2 py-2 flex items-center gap-3"
							onClick={() => changeTheme(theme.name)}
						>
							{/* swatch that uses the theme's primary color */}
							<span className="w-4 h-4 rounded-full bg-primary ring ring-offset-1 ring-offset-base-100" />
							<span className="truncate">{theme.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default ThemeChanger;
