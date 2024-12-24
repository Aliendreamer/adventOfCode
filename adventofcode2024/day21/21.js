import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day22', 'input.txt');
    const codes = readInput(filepath).split('\n');
    const keypad = [
        [7, 8, 9],
        [4, 5, 6],
        [1, 2, 3],
        [null, 0, 'A'],
    ];
    const postionOfA =[3,2];
    const emptyPs
    let answer = 0;

    console.log(answer);
};

measurementWrapper(task1);
