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
	const sep = s.includes("|") && !s.includes(",") ? "|" : ",";
	return s
		.split(sep)
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
	const n = Number(String(raw).trim());
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
