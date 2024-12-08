import path from 'path';
import { readInput, isValid, drawGrid } from '../helpers.mjs';
const isAnthena = (x) => /(\w){1}/gim.test(x);

const getTasksData = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day8', 'input.txt');
    const grid = readInput(filepath)
        .split('\n')
        .map((x) => x.split(''));
    const rows = grid.length;
    const cols = grid[0].length;

    // Find all antennas
    const antennas = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (isAnthena(grid[r][c])) {
                antennas.push({ frequency: grid[r][c], x: c, y: r });
            }
        }
    }
    return { grid, rows, cols, antennas };
};

const task1 = () => {
    let stime = performance.now();
    const { grid, rows, cols, antennas } = getTasksData();

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
                    grid[y][x] = '#';
                }
            }
        }
    }
    drawGrid(grid);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
    return antinodeSet.size;
};

const task2 = () => {
    const { grid, rows, cols, antennas } = getTasksData();
    let stime = performance.now();

    const antinodeSet = new Set();

    // Compare each pair of antennas
    for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
            const { x: x1, y: y1, frequency: freq1 } = antennas[i];
            const { x: x2, y: y2, frequency: freq2 } = antennas[j];

            if (freq1 !== freq2) continue;

            const dx = x2 - x1;
            const dy = y2 - y1;

            // Use GCD to determine step increments
            const gcd = greatestCommonDivisor(Math.abs(dx), Math.abs(dy));
            const stepX = dx / gcd;
            const stepY = dy / gcd;

            // Add all positions along the line (extending beyond antennas)
            let x = x1;
            let y = y1;

            while (isValid(x, y, cols, rows)) {
                antinodeSet.add(`${x},${y}`);
                grid[y][x] = '#';
                x -= stepX;
                y -= stepY;
            }

            x = x1;
            y = y1;
            while (isValid(x, y, cols, rows)) {
                antinodeSet.add(`${x},${y}`);
                grid[y][x] = '#';
                x += stepX;
                y += stepY;
            }
        }
    }

    // Add antennas themselves as antinodes
    for (const { x, y } of antennas) {
        antinodeSet.add(`${x},${y}`);
        grid[y][x] = '#';
    }
    drawGrid(grid);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task2: ${elapsed_time} ms`);
    return antinodeSet.size; // Number of unique antinode locations
};

const greatestCommonDivisor = (a, b) => {
    while (b) {
        [a, b] = [b, a % b];
    }
    return Math.abs(a);
};

console.log(task1());
console.log(task2());
