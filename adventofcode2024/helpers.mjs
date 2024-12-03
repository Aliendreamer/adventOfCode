import fs from "fs";

export const readInput = (filepath) => {
	return fs.readFileSync(filepath, 'utf8');
}