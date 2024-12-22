import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day22', 'input.txt');
    const map = readInput(filepath).split('\n');

    let answer = 0;

    console.log(answer);
};

measurementWrapper(task1);
