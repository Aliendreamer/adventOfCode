import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day15', 'input.txt');
    const robotsInfo = readInput(filepath).split('\n');

    console.log('a');
};

measurementWrapper(task1);
