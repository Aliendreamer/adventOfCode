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

console.log(task1());
console.log(task2());
