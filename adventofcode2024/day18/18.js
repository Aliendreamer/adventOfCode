import path from 'path';
import { readInput, measurementWrapper, isValid, GridMovePatterns, drawGrid } from '../helpers.mjs';

const isWall = (position) => position === '#';
const toKey = (r, c, dir) => `${r},${c},${dir}`;

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day18', 'input.txt');
    const input = readInput(filepath)
        .split('\n')
        .map((x) => x.split(',').map(Number));
    const positions = input.slice(0, 1024);
    const grid = Array.from({ length: 71 }, () => Array.from({ length: 71 }, () => '.'));
    positions.forEach(([x, y]) => {
        grid[y][x] = '#';
    });
    drawGrid(grid);
    const rows = grid.length;
    const cols = grid[0].length;
    const start = [0, 0];
    const end = [rows - 1, cols - 1];
    const visited = new Set();
    let sum = Infinity;
    const heap = [];
    let backTrack = [];
    heap.push([start[0], start[1], undefined, [], 0]);
    while (heap.length > 0) {
        const [r, c, dir, backpath, steps] = heap.shift();

        const currentKey = toKey(r, c, dir);
        if (visited.has(currentKey)) {
            continue;
        }
        visited.add(currentKey);

        if (r === end[0] && c === end[1]) {
            if (sum > steps) {
                sum = steps;
                backTrack = backpath;
            }
        }

        for (let index = 0; index < GridMovePatterns.length; index++) {
            const element = GridMovePatterns[index];
            const nr = r + element[0];
            const nc = c + element[1];
            if (isValid(nr, nc, rows, cols) && !isWall(grid[nr][nc])) {
                const key = toKey(nr, nc, index);
                if (visited.has(key)) {
                    continue;
                }
                heap.push([nr, nc, index, [...backpath, currentKey], steps + 1]);
            }
        }
    }
    console.log(backTrack);
    console.log(sum);
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day18', 'input.txt');
    const input = readInput(filepath)
        .split('\n')
        .map((x) => x.split(',').map(Number));
    const positions = input.slice(0, 1024);
    const corruptedBytes = input.slice(1024);
    const grid = Array.from({ length: 71 }, () => Array.from({ length: 71 }, () => '.'));
    positions.forEach(([x, y]) => {
        grid[y][x] = '#';
    });
    const rows = grid.length;
    const cols = grid[0].length;
    const start = [0, 0];
    const end = [rows - 1, cols - 1];
    let coords = [];
    for (const [x, y] of corruptedBytes) {
        const visited = new Set();
        grid[y][x] = '#';
        let ended = false;
        const heap = [];
        coords = [x, y];
        heap.push([start[0], start[1], undefined]);
        while (heap.length > 0) {
            const [r, c, dir] = heap.shift();

            const currentKey = toKey(r, c, dir);
            if (visited.has(currentKey)) {
                continue;
            }
            visited.add(currentKey);
            // If we reach the end, return the score
            if (r === end[0] && c === end[1]) {
                ended = true;
                break;
            }

            for (let index = 0; index < GridMovePatterns.length; index++) {
                const element = GridMovePatterns[index];
                const nr = r + element[0];
                const nc = c + element[1];
                if (isValid(nr, nc, rows, cols) && !isWall(grid[nr][nc])) {
                    const key = toKey(nr, nc, index);
                    if (visited.has(key)) {
                        continue;
                    }
                    heap.push([nr, nc, index]);
                }
            }
        }
        if (!ended) {
            break;
        }
    }

    console.log(coords.join(','));
};

measurementWrapper(task1);
measurementWrapper(task2);
