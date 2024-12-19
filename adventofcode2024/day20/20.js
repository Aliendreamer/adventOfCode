import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day19', 'input.txt');
    const sections = readInput(filepath).split('\n');
    let possibleCount = 0;
    console.log(possibleCount);
};
