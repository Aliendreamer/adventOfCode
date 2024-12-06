import fs from "fs";

export const readInput = (filepath) => {
	return fs.readFileSync(filepath, 'utf8');
}

export const isValid = (x, y,rows,cols) => x >= 0 && y >= 0 && x < rows && y < cols;

export const GridMovePatterns = [[-1,0],[0,+1],[+1,0],[0,-1]];
