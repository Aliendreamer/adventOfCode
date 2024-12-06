import path from 'path';
import { readInput } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day7', 'input.txt');
    const matrix = readInput(filepath)
        .split('\n')
        .map((x) => x.split(''));

    return matrix;
};

console.log(task1());
