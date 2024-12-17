import path from 'path';
import { readInput, measurementWrapper, isValid, drawGrid, GridMovePatterns } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day17', 'testinput.txt');
    const grid = readInput(filepath);
    console.log('a');
};

measurementWrapper(task1);
