import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day24', 'input.txt');
    const input = readInput(filepath).split('\n\n');
    const initialValues = input[0].split('\n');
    const gateInstructions = input[1].split('\n');
    const wires = {};

    initialValues.forEach((line) => {
        const [wire, value] = line.split(': ').map((x) => x.trim());
        wires[wire] = parseInt(value, 10);
    });

    let gates = gateInstructions.map((instruction) => {
        const [operation, outputWire] = instruction.split(' -> ').map((x) => x.trim());
        const [input1, gate, input2] = operation.split(' ');
        return { input1, gate, input2, outputWire };
    });

    while (gates.length > 0) {
        const remainingGates = [];

        for (const { input1, gate, input2, outputWire } of gates) {
            const val1 = isNaN(input1) ? wires[input1] : parseInt(input1, 10);
            const val2 = isNaN(input2) ? wires[input2] : parseInt(input2, 10);

            // Only evaluate the gate if both inputs are ready.
            if (val1 !== undefined && val2 !== undefined) {
                if (gate === 'AND') wires[outputWire] = val1 & val2;
                else if (gate === 'OR') wires[outputWire] = val1 | val2;
                else if (gate === 'XOR') wires[outputWire] = val1 ^ val2;
            } else {
                remainingGates.push({ input1, gate, input2, outputWire });
            }
        }

        gates = remainingGates;
    }

    const binaryResult = Object.entries(wires)
        .filter(([key]) => key.startsWith('z'))
        .sort(([a], [b]) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10))
        .map(([, value]) => value)
        .reverse()
        .join('');

    const answer = parseInt(binaryResult, 2);
    console.log(answer);
};

measurementWrapper(task1);
