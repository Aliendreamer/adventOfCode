import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const calculate = (secret) => {
    const MODULO = 16777216; // 2^24

    // Step 1: Multiply by 64 and mix
    secret = (secret ^ (secret * 64)) % MODULO;

    // Step 2: Divide by 32 and mix
    secret = (secret ^ Math.floor(secret / 32)) % MODULO;

    // Step 3: Multiply by 2048 and mix
    secret = (secret ^ (secret * 2048)) % MODULO;

    // Ensure positive result
    if (secret < 0) secret += MODULO;

    return secret;
};

const run = (number, calculated) => {
    let currentSecretNumber = number;

    for (let index = 0; index < 2000; index++) {
        if (calculated.has(currentSecretNumber)) {
            currentSecretNumber = calculated.get(currentSecretNumber);
            continue;
        }
        const nextSecretNumber = calculate(currentSecretNumber);
        calculated.set(currentSecretNumber, nextSecretNumber);
        currentSecretNumber = nextSecretNumber;
    }
    return currentSecretNumber;
};

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day22', 'input.txt');
    const numbers = readInput(filepath).split('\n').map(Number);
    const calculated = new Map();
    let monkeyNumbers = 0;
    for (const number of numbers) {
        monkeyNumbers += run(number, calculated);
    }

    console.log(monkeyNumbers);
};

measurementWrapper(task1);
