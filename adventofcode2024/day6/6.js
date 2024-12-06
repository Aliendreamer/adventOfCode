import path from 'path';
import { readInput, isValid, GridMovePatterns } from '../helpers.mjs';

const isObstruction = (position) => position === '#' || position === '0';
const findStartPosition = (row) => row.findIndex((x) => x === '^');
const isFreed = (position, cols, rows) => position[0] < 0 || position[0] >= cols || position[1] < 0 || position[1] >= rows;
const startGuard = (matrix, rows) => {
    let start = [];
    for (let i = 0; i < rows; i++) {
        const row = matrix[i];
        if (row.includes('^')) {
            const position = findStartPosition(row);
            start = [i, position];
            break;
        }
    }
    return start;
};

const task1 = (grid) => {
    let matrix = grid;
    let stime = performance.now();
    if (!grid) {
        const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day6', 'input.txt');
        matrix = readInput(filepath)
            .split('\n')
            .map((x) => x.split(''));
    }
    const rows = matrix.length;
    const cols = matrix[0].length;
    let start = startGuard(matrix, rows);
    let isOut = false;
    // find the start position

    // add first position
    const directions = new Set();
    directions.add(start.join(','));
    //calculate the moves allowed patterns;

    let currentPattern = GridMovePatterns[0];
    while (!isOut) {
        let newPosition = [start[0] + currentPattern[0], start[1] + currentPattern[1]];
        //check if it is obstruction or free
        const isFree = isFreed(newPosition, cols, rows);
        const isBlocker = isValid(newPosition[0], newPosition[1], rows, cols)
            ? isObstruction(matrix[newPosition[0]][newPosition[1]])
            : false;
        if (isFree && !isBlocker) {
            isOut = true;
        }
        if (isBlocker) {
            //change direction
            currentPattern = GridMovePatterns[(GridMovePatterns.indexOf(currentPattern) + 1) % 4];
        }
        if (!isFree && !isBlocker) {
            // if not free or it not blocker that we have to change direction update position and moves
            directions.add(newPosition.join(','));
            start = newPosition;
        }
    }
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
    console.log(`count task 1: ${directions.size}`);
    return { count: directions.size, directions };
};

const seekLoop = (matrix, row, col) => {
    const copiedMatrix = structuredClone(matrix);
    const rows = matrix.length;
    const cols = matrix[0].length;
    copiedMatrix[row][col] = '0';
    let alreadyVisited = new Set();
    let position = [52, 72]; // startGuard(matrix,rows); //[52,72]; from previous task 1 know my starting position always; it is nothing to gain but still
    let looped = false;
    let currentPattern = GridMovePatterns[0];
    while (isValid(position[0], position[1], rows, cols)) {
        let newPosition = [position[0] + currentPattern[0], position[1] + currentPattern[1]];

        if (alreadyVisited.has(position.join(',').concat(currentPattern.join(',')))) {
            looped = true;
            break;
        }
        alreadyVisited.add(position.join(',').concat(currentPattern.join(',')));

        if (!isValid(newPosition[0], newPosition[1], rows, cols)) {
            break;
        }
        const isStop = isObstruction(copiedMatrix[newPosition[0]][newPosition[1]]);
        if (isStop) {
            currentPattern = GridMovePatterns[(GridMovePatterns.indexOf(currentPattern) + 1) % 4];
        }
        if (!isStop) {
            position = newPosition;
        }
    }
    return looped ? 1 : 0;
};

const task2 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day6', 'input.txt');
    const matrix = readInput(filepath)
        .split('\n')
        .map((x) => x.split(''));
    const first = task1(matrix);
    let loops = 0;
    for (const element of first.directions.values()) {
        const position = element.split(',').map((x) => parseInt(x));
        if (matrix[position[0]][position[1]] === '^') {
            continue;
        }
        const newLoop = seekLoop(matrix, position[0], position[1]);
        loops += newLoop;
    }
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task2: ${elapsed_time} ms`);
    console.log(`total loops ${loops}`);
};

console.log(task2());
