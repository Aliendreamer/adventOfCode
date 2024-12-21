import path from 'path';
import { readInput, getEndpoints, measurementWrapper, GridMovePatterns, isValid, isWall } from '../helpers.mjs';

const GridMovePatterns2 = [
    [-2, 0],
    [0, 2],
    [2, 0],
    [0, -2],
];
const toKey = (r, c) => `${r},${c}`;

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day20', 'input.txt');
    const map = readInput(filepath)
        .split('\n')
        .map((x) => x.split(''));
    const { start, end } = getEndpoints(map, map.length, map[0].length, 'S', 'E');
    const rows = map.length;
    const cols = map[0].length;
    const visited = new Map();
    const heap = [];
    let backTrack = [];
    heap.push([start[0], start[1], [], 0]);
    while (heap.length > 0) {
        const [r, c, backpath, steps] = heap.shift();

        const currentKey = toKey(r, c);
        if (visited.has(currentKey)) {
            continue;
        }
        visited.set(currentKey, { r, c, steps });

        if (r === end[0] && c === end[1]) {
            backTrack = [...backpath, `${r},${c}`];
            break;
        }

        for (let index = 0; index < GridMovePatterns.length; index++) {
            const element = GridMovePatterns[index];
            const nr = r + element[0];
            const nc = c + element[1];
            if (isValid(nr, nc, rows, cols) && !isWall(map[nr][nc])) {
                heap.push([nr, nc, [...backpath, currentKey], steps + 1]);
            }
        }
    }

    let answer1 = 0;
    for (const step of backTrack) {
        const [x, y] = step.split(',').map(Number);
        GridMovePatterns2.forEach(([dx, dy]) => {
            const newX = x + dx;
            const newY = y + dy;
            const cheatFrom = visited.get(step);

            const cheatTo = visited.get(`${newX},${newY}`);
            // If so and the diff is >= 100 + the cost of the cheat, increment answer
            if (cheatTo && cheatTo.steps - cheatFrom.steps >= 100 + 2) answer1++;
        });
    }
    console.log(answer1);
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day20', 'input.txt');
    const map = readInput(filepath)
        .split('\n')
        .map((x) => x.split(''));
    const { start, end } = getEndpoints(map, map.length, map[0].length, 'S', 'E');
    const rows = map.length;
    const cols = map[0].length;
    const visited = new Map();
    const heap = [];
    let backTrack = [];
    heap.push([start[0], start[1], [], 0]);
    while (heap.length > 0) {
        const [r, c, backpath, steps] = heap.shift();

        const currentKey = toKey(r, c);
        if (visited.has(currentKey)) {
            continue;
        }
        visited.set(currentKey, { r, c, steps });

        if (r === end[0] && c === end[1]) {
            backTrack = [...backpath, `${r},${c}`];
            break;
        }

        for (let index = 0; index < GridMovePatterns.length; index++) {
            const element = GridMovePatterns[index];
            const nr = r + element[0];
            const nc = c + element[1];
            if (isValid(nr, nc, rows, cols) && !isWall(map[nr][nc])) {
                heap.push([nr, nc, [...backpath, currentKey], steps + 1]);
            }
        }
    }
    // Part 2 - Manhattan distance
    let answer = 0;
    for (let i = 0; i < backTrack.length; i++) {
        const stepsFrom = visited.get(backTrack[i]);
        for (let j = i + 1; j < backTrack.length; j++) {
            const stepsTo = visited.get(backTrack[j]);
            // Calc Manhattan distance between the tracks
            const xDiff = Math.abs(stepsFrom.r - stepsTo.r);
            const yDiff = Math.abs(stepsFrom.c - stepsTo.c);
            const Manhattan = xDiff + yDiff;
            // If Manhattan is 20 or less, and diff is >= 100 + cost of cheat. increment answer
            if (Manhattan <= 20 && stepsTo.steps - stepsFrom.steps >= 100 + Manhattan) answer++;
        }
    }
    console.log(answer);
};

measurementWrapper(task1);
measurementWrapper(task2);
