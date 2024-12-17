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
const task2a = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day16', 'testinput.txt');
    const grid = readInput(filepath)
        .split('\n')
        .map((line) => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;
    const { start, end } = getEndpoints(grid, rows, cols);
    const findAllMinPaths = (start, end) => {
        let stack = [{ p: start, path: [], cost: 0 }];
        let cur = {};
        let seen = {};
        let paths = [];
        let minCost = Infinity;
        while ((cur = stack.shift())) {
            cur.path.push(cur.p[0] + '_' + cur.p[1]);
            if (cur.p[0] == end[0] && cur.p[1] == end[1]) {
                if (cur.cost < minCost) {
                    paths = [];
                    minCost = cur.cost;
                }
                if (cur.cost == minCost) paths.push(cur.path);
                continue;
            }

            let k = cur.p.join('_');
            if (seen[k] < cur.cost) continue;
            seen[k] = cur.cost;
            if (cur.cost > minCost) continue;

            let curD = GridMovePatterns[cur.p[2]];
            GridMovePatterns.forEach((d, dirId) => {
                if (d[0] == -curD && d[1] == -curD[1]) return true;
                let p = [cur.p[0] + d[0], cur.p[1] + d[1], dirId];
                if (grid[p[1]][p[0]] == '#') return true;
                stack.push({
                    path: cur.path.slice(),
                    p: p,
                    cost: cur.cost + (p[2] == cur.p[2] ? 1 : 1001),
                });
            });
        }
        return [paths, minCost];
    };
    const [minPaths, minCost] = findAllMinPaths([...start, 0], end);
    const o = {};
    minPaths.forEach((path) => path.forEach((p) => (o[p] = 1)));

    console.log('p1', minCost);
    console.log('p2', Object.keys(o).length);
};

const task2b = () => {
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

    // Initialize the heap with the starting position
    push([start[0], start[1], 0, 0]);
    distances.set(toKey(start[0], start[1], 0), 0);
    adjustedPaths.set(toKey(start[0], start[1], 0), { score: 0, steps: [] });

    let sums = [];
    let pathOptions = [];

    while (heap.length > 0) {
        const [r, c, score, dir] = heap.shift();

        // If we reach the end, record the score
        if (r === end[0] && c === end[1]) {
            const minSum = Math.min(...sums);
            if (minSum < score) {
                pathOptions = [];
            }
            const tempPaths = [...adjustedPaths.entries()];
            const duble = tempPaths.find(([, value]) => value.score === score);
            pathOptions.push(duble);
            const tempGrid = structuredClone(grid);
            for (const step of duble[1].steps) {
                const [r, c] = step.split(',').map(Number);
                tempGrid[r][c] = 'O';
            }
            drawGrid(tempGrid);
            sums.push(score);
        }

        // Move forward in the current direction
        const [dr, dc] = GridMovePatterns[dir];
        const nr = r + dr;
        const nc = c + dc;

        if (isValid(nr, nc, rows, cols) && !isWall(grid[nr][nc])) {
            const newScore = score + 1;
            const key = toKey(nr, nc, dir);
            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                adjustedPaths.set(key, {
                    score: newScore,
                    steps: [...(adjustedPaths.get(toKey(r, c, dir))?.steps || []), key],
                });
                push([nr, nc, newScore, dir]);
            }
        }

        for (const rotation of [-1, 1]) {
            const newDir = (dir + rotation + 4) % 4;
            const newScore = score + 1000;
            const key = toKey(nr, nc, newDir);
            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                adjustedPaths.set(key, {
                    score: newScore,
                    steps: [...(adjustedPaths.get(toKey(nr, nc, dir))?.steps || []), key],
                });
                push([r, c, newScore, newDir]);
            }
        }
    }

    // Backtracking to reconstruct the path
    const paths = [...adjustedPaths.entries()];
    const sum = Math.min(...sums);
    const optimalPath = paths.find(([, value]) => value.score === sum);

    for (const sum of sums) {
        const op = paths.find(([, value]) => value.score === sum);
        const tempGrid = structuredClone(grid);
        for (const step of op[1].steps) {
            const [r, c] = step.split(',').map(Number);
            tempGrid[r][c] = 'O';
        }
        drawGrid(grid);
        console.log('Sum:', tempGrid);
    }

    if (optimalPath) {
        for (const step of optimalPath[1].steps) {
            const [r, c] = step.split(',').map(Number);
            grid[r][c] = 'O';
        }
        drawGrid(grid);
        const { steps } = optimalPath[1];
        console.log('Optimal Score:', sum);
        console.log('Optimal sums', sums);

        console.log('Optimal Path Steps:', steps.length);
    } else {
        console.log('No valid path found.');
    }
};

const task2bFixed = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day16', 'testinput.txt');
    const grid = readInput(filepath)
        .split('\n')
        .map((line) => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;

    const { start, end } = getEndpoints(grid, rows, cols);

    const directions = [
        [-1, 0], // Up
        [1, 0], // Down
        [0, -1], // Left
        [0, 1], // Right
    ];

    const toKey = (r, c, dir) => `${r},${c},${dir}`;
    const isWall = (cell) => cell === '#';
    const isValid = (r, c) => r >= 0 && c >= 0 && r < rows && c < cols && !isWall(grid[r][c]);

    const distances = new Map();
    const adjustedPaths = new Map();
    const heap = []; // Min-heap for Dijkstra's

    const push = (state) => {
        heap.push(state);
        heap.sort((a, b) => a[2] - b[2]); // Min-heap based on score
    };

    push([start[0], start[1], 0, 0]); // [row, col, score, direction]
    distances.set(toKey(start[0], start[1], 0), 0);
    adjustedPaths.set(toKey(start[0], start[1], 0), { score: 0, steps: [`${start[0]},${start[1]}`] });

    let minScore = Infinity;
    const validPaths = [];

    while (heap.length > 0) {
        const [r, c, score, dir] = heap.shift();

        // Stop processing if we exceed the current minimum score
        if (score > minScore) continue;

        // If we reach the end, update valid paths
        if (r === end[0] && c === end[1]) {
            if (score < minScore) {
                minScore = score;
                validPaths.length = 0; // Clear previous paths
            }
            if (score === minScore) {
                validPaths.push(adjustedPaths.get(toKey(r, c, dir)));
            }
            continue;
        }

        // Explore movements in the current direction
        const [dr, dc] = directions[dir];
        const nr = r + dr;
        const nc = c + dc;

        if (isValid(nr, nc)) {
            const newScore = score + 1;
            const key = toKey(nr, nc, dir);

            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                const prevSteps = adjustedPaths.get(toKey(r, c, dir))?.steps || [];
                adjustedPaths.set(key, {
                    score: newScore,
                    steps: [...prevSteps, `${nr},${nc}`],
                });
                push([nr, nc, newScore, dir]);
            }
        }

        // Handle direction changes (rotations)
        for (const rotation of [-1, 1]) {
            const newDir = (dir + rotation + 4) % 4; // Wrap around 0–3
            const newScore = score + 1000;
            const key = toKey(r, c, newDir);

            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                const prevSteps = adjustedPaths.get(toKey(r, c, dir))?.steps || [];
                adjustedPaths.set(key, {
                    score: newScore,
                    steps: [...prevSteps, `${r},${c}`],
                });
                push([r, c, newScore, newDir]);
            }
        }
    }

    // Collect all unique tiles from valid paths
    const allPathTiles = new Set();
    validPaths.forEach((path) => {
        path.steps.forEach((tile) => {
            allPathTiles.add(tile);
        });
    });

    // Update the grid with all valid path tiles
    const resultGrid = structuredClone(grid);
    allPathTiles.forEach((tile) => {
        const [r, c] = tile.split(',').map(Number);
        resultGrid[r][c] = 'O';
    });

    // Draw the grid and output results
    drawGrid(resultGrid);
    console.log('Minimum Score:', minScore);
    console.log('Number of Optimal Paths:', validPaths.length);
    console.log('Total Tiles in Optimal Paths:', allPathTiles.size);
};

// measurementWrapper(task1);
measurementWrapper(task2bFixed);
