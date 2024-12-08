import path from 'path';
import { readInput, isValid } from '../helpers.mjs';
const isAnthena = (x) => /(\w){1}/gim.test(x);
const task1 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day8', 'input.txt');
    const grid = readInput(filepath)
        .split('\n')
        .map((x) => x.split(''));

    const rows = grid.length;
    const cols = grid[0].length;

    const antennas = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const position = grid[i][j];
            if (isAnthena(position)) {
                antennas.push({ frequency: grid[i][j], x: i, y: j });
            }
        }
    }
    // digit ot letter is valid position
    // # is antinode
    // has to be arround each anthen only if one is  2 times away from the other
    // if there is anthena there dont count it.
    const calculateAntinode = (ant1, ant2) => {
        const { x: x1, y: y1 } = ant1;
        const { x: x2, y: y2 } = ant2;

        if (ant1.frequency !== ant2.frequency) return [];

        // distances
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Calculate antinode positions
        const antinode1 = { x: x1 - dx, y: y1 - dy }; // one diagonal
        const antinode2 = { x: x2 + dx, y: y2 + dy }; // second diagonal

        return [antinode1, antinode2];
    };

    const antinodeSet = new Set();

    // Compare each pair of antennas
    for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
            const antinodes = calculateAntinode(antennas[i], antennas[j]);
            for (const { x, y } of antinodes) {
                if (isValid(x, y, cols, rows)) {
                    antinodeSet.add(`${x},${y}`);
                }
            }
        }
    }

    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
    return antinodeSet.size;
};

const task2 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day8', 'input.txt');
    const grid = readInput(filepath)
        .split('\n')
        .map((x) => x.split(''));

    const rows = grid.length;
    const cols = grid[0].length;

    const antennas = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const position = grid[i][j];
            if (isAnthena(position)) {
                antennas.push({ frequency: grid[i][j], x: i, y: j });
            }
        }
    }
    // digit ot letter is valid position
    // # is antinode
    // has to be arround each anthen only if one is  2 times away from the other
    // if there is anthena there dont count it.
    const calculateAntinode = (ant1, ant2) => {
        const { x: x1, y: y1 } = ant1;
        const { x: x2, y: y2 } = ant2;

        if (ant1.frequency !== ant2.frequency) return [];

        const dx = x2 - x1;
        const dy = y2 - y1;

        // Calculate antinode positions
        const antinode1 = { x: x1, y: y1 - dy }; // one diagonal
        const antinode2 = { x: x2 + dx, y: y2 + dy }; // second diagonal

        return [antinode1, antinode2];
    };

    const antinodeSet = new Set();

    // Compare each pair of antennas
    for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
            const antinodes = calculateAntinode(antennas[i], antennas[j]);
            for (const { x, y } of antinodes) {
                if (isValid(x, y, cols, rows)) {
                    antinodeSet.add(`${x},${y}`);
                }
            }
        }
    }

    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
    return antinodeSet.size;
};

console.log(task1());

console.log(task2());
