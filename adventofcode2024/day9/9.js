import path from 'path';
import { readInput } from '../helpers.mjs';

const task1 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day9', 'input.txt');
    const info = readInput(filepath).split('\n');

    console.log(3);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
};

const task2 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day9', 'input.txt');
    const info = readInput(filepath).split('\n');

    console.log(3);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task2: ${elapsed_time} ms`);
};

task1();
