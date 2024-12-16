import path from 'path';
import { readInput, measurementWrapper, isValid, drawGrid, GridMovePatterns } from '../helpers.mjs';

const toKey = (r, c, dir) => `${r},${c},${dir}`;

const isWall = (position) => position === '#';

const getEndpoints = (grid, rows, cols) => {
    let start = '';
    let end = '';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 'S') {
                start = [i, j];
                break;
            }
            if (grid[i][j] === 'E') {
                end = [i, j];
                break;
            }
        }
    }
    return { start, end };
};
const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day16', 'input.txt');
    const grid = readInput(filepath)
        .split('\n')
        .map((line) => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;
    const { start, end } = getEndpoints(grid, rows, cols);
    const distances = new Map();
    const heap = [];
    const push = (state) => {
        heap.push(state);
        heap.sort((a, b) => a[2] - b[2]);
    };

    // Dijkstra's Algorithm
    push([start[0], start[1], 0, 0]);
    distances.set(toKey(start[0], start[1], 0), 0);
    let sum = 0;
    while (heap.length > 0) {
        const [r, c, score, dir] = heap.shift();

        // If we reach the end, return the score
        if (r === end[0] && c === end[1]) {
            sum = score;
            break;
        }

        const [dr, dc] = GridMovePatterns[dir];
        const nr = r + dr;
        const nc = c + dc;

        if (isValid(nr, nc, rows, cols) && !isWall(grid[nr][nc])) {
            const newScore = score + 1; // Forward movement costs 1 point
            const key = toKey(nr, nc, dir);
            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                push([nr, nc, newScore, dir]);
            }
        }

        for (const rotation of [-1, 1]) {
            const newDir = (dir + rotation + 4) % 4;
            const newScore = score + 1000;
            const key = toKey(r, c, newDir);
            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                push([r, c, newScore, newDir]);
            }
        }
    }
    console.log(sum);
};
const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day16', 'testinput.txt');
    const grid = readInput(filepath)
        .split('\n')
        .map((line) => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;
    const { start, end } = getEndpoints(grid, rows, cols);
    const distances = new Map();
    const adjustedPaths = new Map();
    const heap = [];
    const push = (state) => {
        heap.push(state);
        heap.sort((a, b) => a[2] - b[2]);
    };

    // Dijkstra's Algorithm
    push([start[0], start[1], 0, 0]);
    distances.set(toKey(start[0], start[1], 0), 0);
    adjustedPaths.set(`${start[0]},${start[1]},${0}${0}`, { score: 0, steps: [] });

    let sum = 0;
    let count = 1;
    while (heap.length > 0) {
        const [r, c, score, dir] = heap.shift();

        // If we reach the end, return the score
        if (r === end[0] && c === end[1]) {
            sum = score;
            break;
        }

        const [dr, dc] = GridMovePatterns[dir];
        const nr = r + dr;
        const nc = c + dc;

        if (isValid(nr, nc, rows, cols) && !isWall(grid[nr][nc])) {
            const newScore = score + 1; // Forward movement costs 1 point
            const key = toKey(nr, nc, dir);
            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                const prevKey = toKey(r, c, dir);
                const prev = adjustedPaths.get(`${r},${c},${count - 1}`);
                adjustedPaths.set(`${r},${c},${count}`, { score: newScore, steps: prev?.steps?.concat(key) || [key] });
                count++;
                push([nr, nc, newScore, dir]);
            }
        }

        for (const rotation of [-1, 1]) {
            const newDir = (dir + rotation + 4) % 4;
            const newScore = score + 1000;
            const key = toKey(r, c, newDir);
            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                const prev = adjustedPaths.get(`${r},${c},${count - 1}`);
                adjustedPaths.set(`${r},${c},${count}`, { score: newScore, steps: prev?.steps?.concat(key) || [key] });
                count++;
                push([r, c, newScore, newDir]);
            }
        }
    }
    const paths = [...adjustedPaths.values()];
    const min = paths.filter((x) => x.score === sum);
    console.log(sum);
};
// measurementWrapper(task1);
measurementWrapper(task2);
