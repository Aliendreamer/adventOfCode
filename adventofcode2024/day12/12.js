import path from 'path';
import { readInput, GridMovePatterns, isValid, measurementWrapper } from '../helpers.mjs';

const canContinue = (x, y) => x === y;

const bfsRecursive = (gardens, start, visited, isTask2) => {
    const rows = gardens.length;
    const cols = gardens[0].length;
    const queue = [start];
    const gardenPlots = new Set();
    const gardenFences = new Map();
    let param = 0;
    while (queue.length > 0) {
        const [r, c] = queue.shift();
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        if (gardenPlots.has(key)) continue;
        gardenPlots.add(key);
        visited.set(key);

        // Explore neighbors with a height increase of exactly 1
        for (const [dr, dc] of GridMovePatterns) {
            const nr = r + dr;
            const nc = c + dc;
            if (isValid(nr, nc, rows, cols) && !visited.has(`${nr},${nc}`) && canContinue(gardens[r][c], gardens[nr][nc])) {
                queue.push([nr, nc]);
            }
            if (!canContinue(gardens?.[r]?.[c], gardens?.[nr]?.[nc])) {
                const dirHash = `${dr},${dc}`;
                param++;
                if (!gardenFences.has(dirHash)) {
                    gardenFences.set(dirHash, []);
                }
                gardenFences.get(dirHash).push([nr, nc]);
            }
        }
    }

    if (isTask2) {
        const sides = [...gardenFences.entries()].reduce((sides, [hash, fences]) => {
            const affectsRow = !hash.startsWith('0,');
            let localSides = 1;

            const sorted = [...fences].sort(([r1, c1], [r2, c2]) => {
                if (affectsRow) {
                    return r1 === r2 ? c1 - c2 : r1 - r2;
                }
                return c1 === c2 ? r1 - r2 : c1 - c2;
            });

            for (let i = 1; i < sorted.length; ++i) {
                const [formerFence, laterFence] = [sorted[i - 1], sorted[i]];
                if (
                    laterFence[affectsRow ? 0 : 1] !== formerFence[affectsRow ? 0 : 1] ||
                    laterFence[affectsRow ? 1 : 0] - formerFence[affectsRow ? 1 : 0] > 1
                ) {
                    localSides++;
                }
            }

            return sides + localSides;
        }, 0);

        return gardenPlots.size * sides;
    }

    return gardenPlots.size * param;
};

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day12', 'input.txt');
    const gardens = readInput(filepath)
        .trim()
        .split('\n')
        .map((x) => x.split(''));
    const map = new Map();
    const result = gardens
        .map((x, index) =>
            x.map((y, i) => {
                return bfsRecursive(gardens, [index, i], map, false);
            })
        )
        .flatMap((x) => x)
        .filter((x) => x != 0)
        .reduce((a, b) => a + b, 0);
    console.log(result);
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day12', 'input.txt');
    const gardens = readInput(filepath)
        .trim()
        .split('\n')
        .map((x) => x.split(''));
    const map = new Map();
    const result = gardens
        .map((x, index) =>
            x.map((y, i) => {
                return bfsRecursive(gardens, [index, i], map, true);
            })
        )
        .flatMap((x) => x)
        .filter((x) => x != 0)
        .reduce((a, b) => a + b, 0);
    console.log(result);
};

measurementWrapper(task1);
measurementWrapper(task2);
