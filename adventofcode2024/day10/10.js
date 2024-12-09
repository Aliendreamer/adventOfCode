import path from 'path';
import { readInput } from '../helpers.mjs';

const task1 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day10', 'input.txt');
    const input = readInput(filepath).trim().split('');
    console.log(input);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
};

const task2 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day10', 'input.txt');
    const input = readInput(filepath).trim().split('');
    console.log(input);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task2: ${elapsed_time} ms`);
};
task1();
