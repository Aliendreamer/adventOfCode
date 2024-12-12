import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day13', 'input.txt');
    const gardens = readInput(filepath);
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day13', 'input.txt');
    const gardens = readInput(filepath);
};

measurementWrapper(task1);
