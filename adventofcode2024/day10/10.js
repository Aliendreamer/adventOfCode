import path from 'path';
import { readInput, GridMovePatterns, isValid } from '../helpers.mjs';
const canContinue = (x, y) => x + 1 === y;
const isHikeReached = (x) => x === 9;

function findStarts(heightMap) {
    const trailheads = [];
    for (let r = 0; r < heightMap.length; r++) {
        for (let c = 0; c < heightMap[0].length; c++) {
            if (heightMap[r][c] === 0) {
                trailheads.push([r, c]);
            }
        }
    }
    return trailheads;
}

function bfsTrailheadScore(heightMap, trailhead) {
    const rows = heightMap.length;
    const cols = heightMap[0].length;
    const visited = new Set();
    const queue = [trailhead];
    const reachableNines = new Set();

    while (queue.length > 0) {
        const [r, c] = queue.shift();
        const key = `${r},${c}`;

        if (visited.has(key)) continue;
        visited.add(key);

        if (isHikeReached(heightMap[r][c])) {
            reachableNines.add(key);
            continue;
        }

        // Explore neighbors with a height increase of exactly 1
        for (const [dr, dc] of GridMovePatterns) {
            const nr = r + dr;
            const nc = c + dc;

            if (isValid(nr, nc, rows, cols) && !visited.has(`${nr},${nc}`) && canContinue(heightMap[r][c], heightMap[nr][nc])) {
                queue.push([nr, nc]);
            }
        }
    }

    return reachableNines.size;
}

function dfsTrailCount(heightMap, start) {
    const rows = heightMap.length;
    const cols = heightMap[0].length;
    const stack = [[start, []]];
    const distinctTrails = new Set();

    while (stack.length > 0) {
        const [[r, c], path] = stack.pop();

        // Add the current position to the path
        const newPath = [...path, `${r},${c}`];

        // If this is a 9, add the path to distinctTrails
        if (isHikeReached(heightMap[r][c])) {
            distinctTrails.add(newPath.join('-'));
            continue;
        }

        for (const [dr, dc] of GridMovePatterns) {
            const nr = r + dr;
            const nc = c + dc;

            if (isValid(nr, nc, rows, cols) && canContinue(heightMap[r][c], heightMap[nr][nc]) && !newPath.includes(`${nr},${nc}`)) {
                stack.push([[nr, nc], newPath]);
            }
        }
    }

    return distinctTrails.size;
}

const task1 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day10', 'input.txt');
    const grid = readInput(filepath)
        .trim()
        .split('\n')
        .map((x) => x.split('').map((x) => parseInt(x)));
    let result = 0;
    const trailheads = findStarts(grid);
    for (const trailhead of trailheads) {
        const score = bfsTrailheadScore(grid, trailhead);
        result += score;
        // console.log(`Trailhead at (${trailhead[0]}, ${trailhead[1]}) has score: ${score}`);
    }
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(result);
    console.log(`Execution time task1: ${elapsed_time} ms`);
};

const task2 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day10', 'input.txt');
    const grid = readInput(filepath)
        .trim()
        .split('\n')
        .map((x) => x.split('').map((x) => parseInt(x)));
    let result = 0;
    const trailheads = findStarts(grid);
    for (const trailhead of trailheads) {
        const score = dfsTrailCount(grid, trailhead);
        result += score;
        // console.log(`Trailhead at (${trailhead[0]}, ${trailhead[1]}) has rating: ${score}`);
    }
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(result);
    console.log(`Execution time task2: ${elapsed_time} ms`);
};

task1();
task2();
