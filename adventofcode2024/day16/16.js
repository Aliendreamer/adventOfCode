import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day16', 'input.txt');
    const info = readInput(filepath).split('\n');
};

measurementWrapper(task1);
