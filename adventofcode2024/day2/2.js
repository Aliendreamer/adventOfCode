import path from 'path';
import { readInput } from '../helpers.mjs';

const task1 = () => {
    const info = readInput(path.resolve('adventofcode2024', 'day2', 'testinput.txt'), 'utf8').split('\n');
    const matrix = [];
    for (const element of info) {
        matrix.push(element.split(' ').map(Number));
    }
    let safe = 0;
    for (const element of matrix) {
        if (isSafe(element)) safe++;
    }
    return safe;
};

const task2 = () => {
    const info = readInput(path.resolve('adventofcode2024', 'day2', 'input.txt'), 'utf8').split('\n');
    const matrix = [];
    for (const element of info) {
        matrix.push(element.split(' ').map(Number));
    }
    const safeReports = countSafeReportsWithDampener(matrix);
    console.log(`Number of safe reports: ${safeReports}`);
};
const isSafe = (levels) => {
    const diffs = levels.map((val, i, arr) => (i > 0 ? Math.abs(val - arr[i - 1]) : null)).slice(1);

    const increasing = levels.every((val, i, arr) => i === 0 || val > arr[i - 1]);
    const decreasing = levels.every((val, i, arr) => i === 0 || val < arr[i - 1]);

    const validDiffs = diffs.every((diff) => diff >= 1 && diff <= 3);

    return (increasing || decreasing) && validDiffs;
};

const countSafeReportsWithDampener = (reports) => {
    let safeCount = 0;

    for (const report of reports) {
        if (isSafe(report) || withProblemDampener(report)) {
            safeCount++;
        }
    }

    return safeCount;
};

const withProblemDampener = (levels) => {
    for (let i = 0; i < levels.length; i++) {
        const modified = levels.slice(0, i).concat(levels.slice(i + 1));
        if (isSafe(modified)) {
            return true;
        }
    }
    return false;
};

console.log(task1());
console.log(task2());
