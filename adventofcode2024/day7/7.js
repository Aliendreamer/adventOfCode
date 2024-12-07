import path from 'path';
import { readInput } from '../helpers.mjs';
const operators = ['+', '*', '||'];

function generateExpressions(numbers, operators, index = 0, currentExpression = '') {
    if (index === numbers.length - 1) {
        // Base case: if at the last number, return the completed expression
        return [currentExpression + numbers[index]];
    }

    const expressions = [];
    for (let operator of operators) {
        // Add current number, operator, and recurse
        const newExpression = currentExpression + numbers[index] + ` ${operator} `;
        expressions.push(...generateExpressions(numbers, operators, index + 1, newExpression));
    }

    return expressions;
}
// do evaluation from left to right
function evaluateLeftToRight(expression) {
    const tokens = expression.split(' ');
    let result = parseInt(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNumber = parseInt(tokens[i + 1]);

        if (operator === '+') {
            result += nextNumber;
        } else if (operator === '*') {
            result *= nextNumber;
        } else {
            result = parseInt('' + result + nextNumber);
        }
    }

    return result;
}

// Main function to find all matching configurations
function findMatchingConfigurations(numbers, operators, target) {
    const expressions = generateExpressions(numbers, operators);
    let results = 0;

    for (let expr of expressions) {
        if (evaluateLeftToRight(expr) === target) {
            results += target;
            break;
        }
    }

    return results;
}

const task1 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day7', 'input.txt');
    const input = readInput(filepath)
        .split('\n')
        .map((x) => x.split(':'));
    let combinations = 0;
    for (const element of input) {
        const searched = parseInt(element[0]);
        const numbers = element[1]
            .split(' ')
            .map((x) => parseInt(x))
            .filter((x) => !isNaN(x));
        combinations += findMatchingConfigurations(numbers, operators.slice(0, 2), searched);
    }
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
    return combinations;
};

const task2 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day7', 'input.txt');
    const input = readInput(filepath)
        .split('\n')
        .map((x) => x.split(':'));
    let combinations = 0;
    for (const element of input) {
        const searched = parseInt(element[0]);
        const numbers = element[1]
            .split(' ')
            .map((x) => parseInt(x))
            .filter((x) => !isNaN(x));
        combinations += findMatchingConfigurations(numbers, operators, searched);
    }
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task2: ${elapsed_time} ms`);
    return combinations;
};

const simpler = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day7', 'input.txt');
    const lines = readInput(filepath).split('\n');
    const solve = (target, numbers, val, combine) => {
        if (!numbers.length) return val === target;
        if (val > target) return false;

        const [curr, ...rem] = numbers;

        return (
            solve(target, rem, val * curr, combine) ||
            solve(target, rem, val + curr, combine) ||
            (combine && solve(target, rem, Number(`${val}${curr}`), combine))
        );
    };

    let part1 = 0,
        part2 = 0;
    for (const line of lines) {
        const [target, first, ...rem] = line.split(/:? /).map(Number);
        part1 += solve(target, rem, first, false) ? target : 0;
        part2 += solve(target, rem, first, true) ? target : 0;
    }
    console.log(part1, part2);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time  recursive: ${elapsed_time} ms`);
};

// console.log(task1());
//console.log(task2());
// simpler();

const simpler2 = () => {
    let stime = performance.now();

    // Filepath and input reading
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day7', 'input.txt');
    const lines = readInput(filepath).split('\n');

    // Mathematical concatenation function this i saw from internet in the solutions it really halves the time
    const concatNumbers = (a, b) => {
        const pow = Math.floor(Math.log10(b) + 1); // Number of digits in b
        return a * Math.pow(10, pow) + b; // Shift a and add b
    };

    // Recursive solve function
    const solve = (target, numbers, val, combine) => {
        if (!numbers.length) return val === target; // Base case: if no numbers left, check target
        if (val > target) return false; // If value exceeds target, stop further exploration

        const [curr, ...rem] = numbers;

        return (
            solve(target, rem, val * curr, combine) || // Try multiplication
            solve(target, rem, val + curr, combine) || // Try addition
            (combine && solve(target, rem, concatNumbers(val, curr), combine)) // Try mathematical concatenation if allowed
        );
    };

    // Processing input
    let part1 = 0,
        part2 = 0;
    for (const line of lines) {
        const [target, first, ...rem] = line.split(/:? /).map(Number);
        part1 += solve(target, rem, first, false) ? target : 0; // Solve without concatenation
        part2 += solve(target, rem, first, true) ? target : 0; // Solve with concatenation
    }

    console.log('Part 1:', part1); // Total calibration result for addition and multiplication
    console.log('Part 2:', part2); // Total calibration result with concatenation included

    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time: ${elapsed_time.toFixed(2)} ms`);
};

simpler2();
