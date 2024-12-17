import path from 'path';
import { readInput, measurementWrapper, isValid, GridMovePatterns } from '../helpers.mjs';

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

    // Movement directions: [row delta, col delta] corresponding to directions
    const GridMovePatterns = [
        [0, 1], // East
        [1, 0], // South
        [0, -1], // West
        [-1, 0], // North
    ];
    const oppositeDirection = [2, 3, 0, 1]; // Opposite directions
    const toKey = (r, c, dir) => `${r},${c},${dir}`;

    // Min-heap for Dijkstra's algorithm
    const heap = [];

    const distances = new Map();

    // Start state: [row, col, cost, direction, steps, path history]
    heap.push({ r: start[0], c: start[1], score: 0, dir: 0, steps: 0, history: [`${start[0]},${start[1]}`] });
    distances.set(toKey(start[0], start[1], 0), 0);

    let minCost = Infinity;
    const optimalPaths = [];

    while (heap.length > 0) {
        const { r, c, score, dir, steps, history } = heap.shift();

        // Stop when we reach the end
        if (r === end[0] && c === end[1]) {
            if (score < minCost) {
                minCost = score;
                optimalPaths.length = 0; // Clear previous paths
            }
            if (score === minCost) {
                optimalPaths.push(history);
            }
            continue;
        }

        // Move forward in the same direction
        const [dr, dc] = GridMovePatterns[dir];
        const nr = r + dr;
        const nc = c + dc;

        if (isValid(nr, nc, rows, cols) && !isWall(grid[nr][nc])) {
            const newScore = score + 1;
            const key = toKey(nr, nc, dir);

            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                heap.push({ r: nr, c: nc, score: newScore, dir, steps: steps + 1, history: [...history, `${nr},${nc}`] });
            }
        }

        for (let newDir = 0; newDir < 4; newDir++) {
            if (newDir === dir || newDir === oppositeDirection[dir]) continue;
            // here i probably make it score 1000 + 1000 as i cant make the distinction correctly if one path already passed
            // this tile and this fucks me up and I am fucking lost as I correctly find 7036 but then other two are 8036 which is basically
            // this one single tile that is already used to turn that i double
            // the other task2a underscores it but get teh paths correctly and i am in the blind here
            const key = toKey(r, c, newDir);
            const newScore = distances.has(key) ? distances.get(key) : score + 1000; // Turning costs 1000
            if (newScore < (distances.get(key) || Infinity)) {
                distances.set(key, newScore);
                heap.push({ r, c, score: newScore, dir: newDir, steps, history: [...history, `${r},${c}`] });
            }
        }
    }

    // Output Results
    console.log(`Optimal Score: ${minCost}`);
    console.log(`Number of Optimal Paths: ${optimalPaths.length}`);
};

// measurementWrapper(task1);
measurementWrapper(task2b);
