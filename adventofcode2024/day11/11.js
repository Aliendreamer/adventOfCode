import path from 'path';
import { readInput } from '../helpers.mjs';

const isFirstRule = (x) => x === 0;
const isSecondRule = (x) => x.toString().length % 2 === 0;

const task1naive = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day11', 'input.txt');
    const numbers = readInput(filepath).trim().split(' ').map(Number);
    const numberOfBlinks = 25;
    let blink = 0;
    while (numberOfBlinks > blink) {
        for (let index = 0; index < numbers.length; index++) {
            if (isFirstRule(numbers[index])) {
                numbers[index] = 1;
                continue;
            }
            if (isSecondRule(numbers[index])) {
                const s = `${numbers[index]}`;
                const left = parseInt(s.slice(0, s.length / 2));
                const right = parseInt(s.slice(s.length / 2, s.length));
                numbers[index] = left;
                numbers.splice(index + 1, 0, right);
                index++;
                continue;
            }
            numbers[index] = numbers[index] * 2024;
        }
        blink++;
    }
    console.log(numbers.length);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
};

const parseAndBreak = (key, lruCache, blink, currentList) => {
    if (blink === 0) return 1;

    blink -= 1;
    let l = 0;
    for (const v of currentList) {
        if (isFirstRule(v)) {
            if (lruCache.has(key(blink, 1))) l += lruCache.get(key(blink, 1));
            else {
                const sl = parseAndBreak(key, lruCache, blink, [1]);
                lruCache.set(key(blink, 1), sl);
                l += sl;
            }
            continue;
        }
        const s = `${v}`;
        if (isSecondRule(s)) {
            const left = parseInt(s.slice(0, s.length / 2));
            const right = parseInt(s.slice(s.length / 2, s.length));

            if (lruCache.has(key(blink, left))) l += lruCache.get(key(blink, left));
            else {
                const sl = parseAndBreak(key, lruCache, blink, [left]);
                lruCache.set(key(blink, left), sl);
                l += sl;
            }

            if (lruCache.has(key(blink, right))) l += lruCache.get(key(blink, right));
            else {
                const sl = parseAndBreak(key, lruCache, blink, [right]);
                lruCache.set(key(blink, right), sl);
                l += sl;
            }
            continue;
        }
        const nv = v * 2024;
        if (lruCache.has(key(blink, nv))) l += lruCache.get(key(blink, nv));
        else {
            const sl = parseAndBreak(key, lruCache, blink, [nv]);
            lruCache.set(key(blink, nv), sl);
            l += sl;
        }
    }
    return l;
};

const task2 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day11', 'input.txt');
    const numbers = readInput(filepath).trim().split(' ').map(Number);
    const lruCache = new Map();
    const key = (blink, value) => `${blink}:${value}`;

    let result = parseAndBreak(key, lruCache, 75, numbers);
    console.log(result);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
};

const task1 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day11', 'input.txt');
    const numbers = readInput(filepath).trim().split(' ').map(Number);
    const lruCache = new Map();
    const key = (blink, value) => `${blink}:${value}`;

    let result = parseAndBreak(key, lruCache, 25, numbers);
    console.log(result);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
};
task1();
task2();

task1naive();
