import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const mod = (n, m) => ((n % m) + m) % m;

const resolveComboOperand = (operand, registers) => {
    if (operand <= 3) return operand; // Literal values 0–3
    if (operand === 4) return registers.A;
    if (operand === 5) return registers.B;
    if (operand === 6) return registers.C;
    if (operand === 7) throw new Error('Invalid combo operand 7');
};

// task1 dumb
const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day17', 'input.txt');
    const info = readInput(filepath).split('\n');
    const initialA = parseInt(info[0].split(':')[1]);
    const initialB = parseInt(info[1].split(':')[1]);
    const initialC = parseInt(info[2].split(':')[1]);
    const programInfo = info.at(-1).split(':');
    const program = programInfo[1].split(',').map(Number);
    // Registers A, B, C
    let registers = { A: initialA, B: initialB, C: initialC };

    // Output storage
    let output = [];

    // Instruction pointer
    let ip = 0;

    // Helper function to resolve combo operands

    while (ip < program.length) {
        const opcode = program[ip];
        const operand = program[ip + 1];

        switch (opcode) {
            case 0: // adv
                registers.A = Math.trunc(registers.A / Math.pow(2, resolveComboOperand(operand, registers)));
                break;

            case 1: // bxl
                registers.B = registers.B ^ operand;
                break;

            case 2: // bst
                registers.B = resolveComboOperand(operand, registers) % 8;
                break;

            case 3: // jnz
                if (registers.A !== 0) {
                    ip = operand;
                    continue;
                }
                break;

            case 4: // bxc
                registers.B = registers.B ^ registers.C;
                break;

            case 5: // out
                output.push(resolveComboOperand(operand, registers) % 8);
                break;

            case 6: // bdv
                registers.B = Math.trunc(registers.A / Math.pow(2, resolveComboOperand(operand, registers)));
                break;

            case 7: // cdv
                registers.C = Math.trunc(registers.A / Math.pow(2, resolveComboOperand(operand, registers)));
                break;

            default:
                throw new Error(`Unknown opcode ${opcode} at position ${ip}`);
        }

        ip += 2;
    }
    console.log(output.join(','));
};

const task1a = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day17', 'input.txt');
    const info = readInput(filepath).split('\n');
    let A = parseInt(info[0].split(':')[1]);
    let B = parseInt(info[1].split(':')[1]);
    let C = parseInt(info[2].split(':')[1]);
    const programInfo = info.at(-1).split(':');
    const program = programInfo[1].split(',').map(Number);
    const out = [];
    let ptr = 0;
    while (program[ptr] !== undefined) {
        const code = program[ptr];
        const operand = program[ptr + 1];
        let combo;
        if ([0, 1, 2, 3].includes(operand)) combo = operand;
        if (operand === 4) combo = A;
        if (operand === 5) combo = B;
        if (operand === 6) combo = C;

        if (code === 0) A = Math.floor(A / Math.pow(2, combo));
        if (code === 1) B = (B ^ operand) >>> 0;
        if (code === 2) B = mod(combo, 8);

        let jumped = false;
        if (code === 3 && A !== 0) {
            ptr = operand;
            jumped = true;
        }
        if (code === 4) B = (B ^ C) >>> 0;
        if (code === 5) out.push(mod(combo, 8));
        if (code === 6) B = Math.floor(A / Math.pow(2, combo));
        if (code === 7) C = Math.floor(A / Math.pow(2, combo));

        if (!jumped) ptr += 2;
    }
    console.log(out.join(','));
    return out;
};

const task1asFunc = (A, B, C, program) => {
    const out = [];
    let ptr = 0;
    while (program[ptr] !== undefined) {
        const code = program[ptr];
        const operand = program[ptr + 1];
        let combo;
        if ([0, 1, 2, 3].includes(operand)) combo = operand;
        if (operand === 4) combo = A;
        if (operand === 5) combo = B;
        if (operand === 6) combo = C;

        if (code === 0) A = Math.floor(A / Math.pow(2, combo));
        if (code === 1) B = (B ^ operand) >>> 0;
        if (code === 2) B = mod(combo, 8);

        let jumped = false;
        if (code === 3 && A !== 0) {
            ptr = operand;
            jumped = true;
        }
        if (code === 4) B = (B ^ C) >>> 0;
        if (code === 5) out.push(mod(combo, 8));
        if (code === 6) B = Math.floor(A / Math.pow(2, combo));
        if (code === 7) C = Math.floor(A / Math.pow(2, combo));

        if (!jumped) ptr += 2;
    }
    return out.join(',');
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day17', 'input.txt');
    const info = readInput(filepath).split('\n');
    let B = parseInt(info[1].split(':')[1]);
    let C = parseInt(info[2].split(':')[1]);
    const programInfo = info.at(-1).split(':');
    const program = programInfo[1].split(',').map(Number);

    const Q = [];
    Q.push({ result: '', len: 0 });
    while (Q.length) {
        const q = Q.shift();
        if (q.len === program.length) {
            console.log('B', parseInt(q.result, 2));
            break;
        }
        const from = parseInt(q.result + '000', 2);
        const to = parseInt(q.result + '111', 2);
        const expect = program.slice((q.len + 1) * -1).join(',');
        for (let a = from; a <= to; a++) {
            const r = task1asFunc(a, B, C, program);
            if (r === expect) {
                Q.push({ result: a.toString(2), len: q.len + 1 });
            }
        }
    }
};

// measurementWrapper(task1);
// measurementWrapper(task1a);
measurementWrapper(task2);
