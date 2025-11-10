import Exercise from "../models/exercise.model.js";

const MAX_ROWS = 1000; // safety limit: tweak as needed

// state-machine CSV line parser that handles quoted fields and escaped quotes ("")
function parseCSVLine(line) {
	const result = [];
	let cur = "";
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			// handle escaped double-quote inside quoted field: ""
			if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
				cur += '"';
				i++; // skip next quote
			} else {
				inQuotes = !inQuotes;
			}
		} else if (ch === "," && !inQuotes) {
			result.push(cur);
			cur = "";
		} else {
			cur += ch;
		}
	}
	result.push(cur);
	// Trim spaces and remove surrounding quotes if any left
	return result.map((cell) => {
		if (cell === null || cell === undefined) return "";
		let c = String(cell);
		// remove leading/trailing whitespace
		c = c.trim();
		// if whole cell is quoted (e.g., "a,b"), strip surrounding quotes (they may still be present)
		if (c.length >= 2 && c[0] === '"' && c[c.length - 1] === '"') {
			c = c.slice(1, -1);
		}
		return c;
	});
}

function parseArrayField(raw) {
	if (raw === undefined || raw === null) return [];
	const s = String(raw).trim();
	if (!s) return [];
	
	// If user used pipes, prefer them (good for CSV with commas in elements)
	if (s.includes("|") && !s.includes(",") && !s.includes("/")) {
		return s.split("|").map((x) => String(x).trim()).filter(Boolean);
	}
	
	// Check for forward slash separator (like "Chest/Shoulders")
	if (s.includes("/") && !s.includes(",")) {
		return s.split("/").map((x) => String(x).trim()).filter(Boolean);
	}
	
	// Default to comma separator
	return s
		.split(",")
		.map((x) => String(x).trim())
		.filter(Boolean);
}

function parseBoolean(raw) {
	if (raw === undefined || raw === null) return false;
	const s = String(raw).trim().toLowerCase();
	if (!s) return false;
	return s === "true" || s === "1" || s === "yes" || s === "y";
}

function parseInteger(raw, fallback = null) {
	if (raw === undefined || raw === null || raw === "") return fallback;
	const str = String(raw).trim();
	
	// Handle range formats like "8-15", "10-20", etc. - take the middle value
	if (str.includes("-")) {
		const parts = str.split("-").map(p => p.trim());
		if (parts.length === 2) {
			const start = Number(parts[0]);
			const end = Number(parts[1]);
			if (Number.isFinite(start) && Number.isFinite(end)) {
				return Math.trunc((start + end) / 2);
			}
		}
	}
	
	// Handle formats like "30-60(min)" or "10-15(each)"
	const match = str.match(/^(\d+)-(\d+)/);
	if (match) {
		const start = Number(match[1]);
		const end = Number(match[2]);
		if (Number.isFinite(start) && Number.isFinite(end)) {
			return Math.trunc((start + end) / 2);
		}
	}
	
	// Handle simple numeric values
	const n = Number(str);
	return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

// create unique slug by checking existence and appending suffixes
async function ensureUniqueSlug(baseSlug) {
	let slug = baseSlug;
	let i = 0;
	// loop until unique; small race condition remains if two imports run concurrently with same slug,
	// you can use a unique index and handle duplicate-key errors below as additional safety.
	while (await Exercise.exists({ slug })) {
		i += 1;
		slug = `${baseSlug}-${i}`;
	}
	return slug;
}

export {
	MAX_ROWS,
	parseCSVLine,
	parseArrayField,
	parseBoolean,
	parseInteger,
	ensureUniqueSlug,
};
