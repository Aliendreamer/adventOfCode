import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const parseSchematicToHeights = (schematic) => {
    const rows = schematic.split('\n');
    const numColumns = rows[0].length;
    const heights = Array(numColumns).fill(0);

    const isLock = rows[0].includes('#') && rows[rows.length - 1].includes('.');

    for (let col = 0; col < numColumns; col++) {
        let height = 0;

        if (isLock) {
            // Calculate lock heights (top-down)
            for (const row of rows) {
                if (row[col] === '#') {
                    height++;
                } else {
                    break;
                }
            }
        } else {
            // Calculate key heights (bottom-up)
            for (let row = rows.length - 1; row >= 0; row--) {
                if (rows[row][col] === '#') {
                    height++;
                } else {
                    break;
                }
            }
        }

        heights[col] = height;
    }

    return { heights, isLock };
};

const calculate = (schematics) => {
    const locks = [];
    const keys = [];

    schematics.forEach((schematic) => {
        const { heights, isLock } = parseSchematicToHeights(schematic);
        if (isLock) {
            locks.push(heights);
        } else {
            keys.push(heights);
        }
    });

    let validPairs = 0;
    const totalRows = schematics[0].split('\n').length;

    locks.forEach((lockHeights) => {
        keys.forEach((keyHeights) => {
            // Check if all columns fit
            const fits = lockHeights.every((lh, idx) => lh + keyHeights[idx] <= totalRows);
            if (fits) {
                validPairs++;
            }
        });
    });

    return validPairs;
};

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day25', 'input.txt');
    const schematics = readInput(filepath).split('\n\n');

    const result = calculate(schematics);
    console.log(result);
};

measurementWrapper(task1);
