import path from 'path';
import { readInput, isValid } from '../helpers.mjs';

const search = (x, y, dx, dy, target, grid, rows, cols) => {
    for (let i = 0; i < target.length; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (!isValid(nx, ny, rows, cols) || grid[nx][ny] !== target[i]) {
            return false;
        }
    }
    return true;
};

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day4', 'input.txt');
    const grid = readInput(filepath).split('\n');
    const directions = [
        [0, 1], // Right
        [0, -1], // Left
        [1, 0], // Down
        [-1, 0], // Up
        [1, 1], // Down-Right
        [1, -1], // Down-Left
        [-1, 1], // Up-Right
        [-1, -1], // Up-Left
    ];

    const target = 'XMAS';
    let count = 0;

    const rows = grid.length;
    const cols = grid[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            for (const [dx, dy] of directions) {
                if (search(i, j, dx, dy, target, grid, rows, cols)) {
                    count++;
                }
            }
        }
    }

    return count;
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day4', 'input.txt');
    const grid = readInput(filepath).split('\n');
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    for (let i = 0; i <= rows - 3; i++) {
        for (let j = 0; j <= cols - 3; j++) {
            if (isXMASPattern(grid, i, j)) {
                count++;
            }
        }
    }

    return count;
};

function isXMASPattern(grid, i, j) {
    const topLeft = grid[i][j];
    const topRight = grid[i][j + 2];
    const middle = grid[i + 1][j + 1];
    const bottomLeft = grid[i + 2][j];
    const bottomRight = grid[i + 2][j + 2];

    const isValidDiagonal =
        (topLeft === 'M' && middle === 'A' && bottomRight === 'S') || // MAS
        (topLeft === 'S' && middle === 'A' && bottomRight === 'M'); // SAM

    const isValidAntiDiagonal =
        (topRight === 'M' && middle === 'A' && bottomLeft === 'S') || // MAS
        (topRight === 'S' && middle === 'A' && bottomLeft === 'M'); // SAM

    return isValidDiagonal && isValidAntiDiagonal;
}

console.log(task1());
console.log(task2());
