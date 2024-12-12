import fs from 'fs';

export const readInput = (filepath) => {
    return fs.readFileSync(filepath, 'utf8').trim();
};

export const isValid = (x, y, rows, cols) => x >= 0 && y >= 0 && x < rows && y < cols;

export const GridMovePatterns = [
    [-1, 0],
    [0, +1],
    [+1, 0],
    [0, -1],
];

export const GridMovePatternsAndDiagonals = [
    [0, 1], // Right
    [0, -1], // Left
    [1, 0], // Down
    [-1, 0], // Up
    [1, 1], // Down-Right
    [1, -1], // Down-Left
    [-1, 1], // Up-Right
    [-1, -1], // Up-Left
];

export const drawGrid = (grid) => {
    console.log(grid.map((row) => row.join('')).join('\n'));
};

export const measurementWrapper = (fn) => {
    let stime = performance.now();
    fn();
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
};
