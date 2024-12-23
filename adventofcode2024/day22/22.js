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

const run = (number, calculated, arr) => {
    let currentSecretNumber = number;

    for (let index = 0; index < 2000; index++) {
        if (calculated.has(currentSecretNumber)) {
            currentSecretNumber = calculated.get(currentSecretNumber);
            arr.push(currentSecretNumber % 10);
            continue;
        }
        const nextSecretNumber = calculate(currentSecretNumber);
        calculated.set(currentSecretNumber, nextSecretNumber);
        currentSecretNumber = nextSecretNumber;
        arr.push(currentSecretNumber % 10);
    }
    return currentSecretNumber;
};

const calculateBananas = (lastDigits, countBananas) => {
    lastDigits.forEach((arr) => {
        const seen = new Set();
        // Keep track of seen patterns to evaluate them once per secret number
        // Initialize the first pattern values
        let [a, b, c, d, e] = [arr[0], arr[1], arr[2], arr[3], arr[4]];
        // Convert into initial diffs
        a = b - a;
        b = c - b;
        c = d - c;
        d = e - d;
        for (let i = 0; i < arr.length - 4; i++) {
            // Avoid overly scanning the array, shift values instead
            if (i) {
                a = b;
                b = c;
                c = d;
                d = arr[i + 4] - arr[i + 3];
            }
            // Create string pattern to use as key
            const key = `${a},${b},${c},${d}`;
            // Get bananas
            const bananas = arr[i + 4];
            // If it's the first time we see this key for the current secret number
            if (!seen.has(key)) {
                // Remember it
                seen.add(key);
                // Add bananas to the count for this key
                countBananas.set(key, (countBananas.get(key) || 0) + bananas);
            }
        }
    });
};

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day22', 'input.txt');
    const numbers = readInput(filepath).split('\n').map(Number);
    const calculated = new Map();
    let monkeyNumbers = 0;
    for (const number of numbers) {
        monkeyNumbers += run(number, calculated, []);
    }

    console.log(monkeyNumbers);
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day22', 'input.txt');
    const numbers = readInput(filepath).split('\n').map(Number);
    const calculated = new Map();
    let monkeyNumbers = 0;
    const countBananas = new Map();

    const lastDigits = [];
    for (const number of numbers) {
        const temArr = [number % 10];
        monkeyNumbers += run(number, calculated, temArr);
        lastDigits.push(temArr);
    }

    calculateBananas(lastDigits, countBananas);
    console.log(`Task 1 ${monkeyNumbers}`);

    console.log(`Task 2 ${Math.max(...countBananas.values())}`);
};

measurementWrapper(task1);
measurementWrapper(task2);
