import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const calculatePathButton = (machine) => {
    // Extract coefficients for the equations
    const aX = machine.buttonA[0];
    const aY = machine.buttonA[1];
    const bX = machine.buttonB[0];
    const bY = machine.buttonB[1];
    const targetX = machine.prize[0];
    const targetY = machine.prize[1];

    const determinant = aX * bY - aY * bX;

    if (determinant === 0) {
        return { solvable: false, tokens: null, presses: null };
    }

    // Solve using Cramer's Rule
    const determinantA = targetX * bY - targetY * bX;
    const determinantB = aX * targetY - aY * targetX;

    const a = determinantA / determinant;
    const b = determinantB / determinant;

    // If solutions are non-integers, the system is not practically solvable
    if (a < 0 || b < 0 || !Number.isInteger(a) || !Number.isInteger(b)) {
        return { solvable: false, tokens: null, presses: null };
    }

    // Calculate cost
    const tokens = a * 3 + b * 1;
    return { solvable: true, tokens, presses: { A: a, B: b } };
};

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day13', 'input.txt');
    const vendorMachines = readInput(filepath).split('\n').filter(Boolean);
    const machines = new Map();
    const regex = /(\d+)/gim;
    for (let index = 2; index < vendorMachines.length; index += 3) {
        const prize = vendorMachines[index].match(regex).map(Number);
        const buttonB = vendorMachines[index - 1].match(regex).map(Number);
        const buttonA = vendorMachines[index - 2].match(regex).map(Number);
        const machine = { prize, buttonA, buttonB };
        machines.set(index, machine);
    }
    let totalTokens = 0;
    let prizesWon = 0;

    for (const machine of machines.values()) {
        const presses = calculatePathButton(machine);
        if (presses.solvable) {
            prizesWon++;
            totalTokens += presses.tokens;
        }
    }

    console.log(`\nTotal Prizes Won: ${prizesWon}`);
    console.log(`Total Tokens Spent: ${totalTokens}`);
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day13', 'input.txt');
    const vendorMachines = readInput(filepath).split('\n').filter(Boolean);
    const machines = new Map();
    const regex = /(\d+)/gim;
    for (let index = 2; index < vendorMachines.length; index += 3) {
        const prize = vendorMachines[index]
            .match(regex)
            .map(Number)
            .map((x) => x + 10000000000000);
        const buttonB = vendorMachines[index - 1].match(regex).map(Number);
        const buttonA = vendorMachines[index - 2].match(regex).map(Number);
        const machine = { prize, buttonA, buttonB };
        machines.set(index, machine);
    }

    let totalTokens = 0;
    let prizesWon = 0;

    for (const machine of machines.values()) {
        const presses = calculatePathButton(machine);
        if (presses.solvable) {
            prizesWon++;
            totalTokens += presses.tokens;
        }
    }

    console.log(`\nTotal Prizes Won: ${prizesWon}`);
    console.log(`Total Tokens Spent: ${totalTokens}`);
};

measurementWrapper(task1);
measurementWrapper(task2);
