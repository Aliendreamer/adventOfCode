import path from 'path';
import { readInput, GridMovePatterns, isValid } from '../helpers.mjs';

const canContinue = (x, y) => x === y;

const bfsRecursive = (gardens, start, visited) => {
    const rows = gardens.length;
    const cols = gardens[0].length;
    const queue = [start];
    const gardenPlots = new Set();
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
        }
    }

    let size = 0;
    for (const key of gardenPlots.values()) {
        const [r, c] = key.split(',').map(Number);
        for (const [dr, dc] of GridMovePatterns) {
            const nr = r + dr;
            const nc = c + dc;

            if (!isValid(nr, nc, rows, cols) || !canContinue(gardens[r][c], gardens[nr][nc])) {
                size++;
            }
        }
    }
    return gardenPlots.size * size;
};

const task1 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day12', 'input.txt');
    const gardens = readInput(filepath)
        .trim()
        .split('\n')
        .map((x) => x.split(''));
    const map = new Map();
    const result = gardens
        .map((x, index) =>
            x.map((y, i) => {
                return bfsRecursive(gardens, [index, i], map);
            })
        )
        .flatMap((x) => x)
        .filter((x) => x != 0)
        .reduce((a, b) => a + b, 0);
    console.log(result);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
};
// task1();

// (data, row, col) => data[row][col] === regionId
function dfs(data, row, col, visited, isMoveAllowed, onMove) {
    onMove(data, row, col, visited);
    visited.add(`${row},${col}`);
    const rols = data.length;
    const cols = data[0].length;
    GridMovePatterns.forEach(([dx, dy]) => {
        const [nextRow, nextCol] = [row + dx, col + dy];
        if (
            !visited.has(`${nextRow},${nextCol}`) &&
            isValid(nextRow, nextCol, cols, rols) &&
            isMoveAllowed(data, nextRow, nextCol, visited)
        ) {
            dfs(data, nextRow, nextCol, visited, isMoveAllowed, onMove);
        }
    });
}

function measure(data, row, col, visited) {
    const regionId = data[row][col];
    let perimeter = 0;
    let region = 0;
    const dirToFences = new Map();

    dfs(
        data,
        row,
        col,
        visited,
        (data, row, col) => data[row][col] === regionId,
        (data, row, col, visited) => {
            if (visited.has(`${row},${col}`)) {
                return;
            }
            if (data[row][col] === regionId) {
                region++;
            }
            GridMovePatterns.forEach(([dx, dy]) => {
                if (data[row + dx]?.[col + dy] !== regionId) {
                    perimeter++;

                    const dirHash = `${dx},${dy}`;
                    if (!dirToFences.has(dirHash)) {
                        dirToFences.set(dirHash, []);
                    }
                    dirToFences.get(dirHash).push([row + dx, col + dy]);
                }
            });
        }
    );

    const sides = [...dirToFences.entries()].reduce((sides, [hash, fences]) => {
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

    return {
        region,
        sides,
    };
}

const task2 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day12', 'input.txt');
    const gardens = readInput(filepath)
        .trim()
        .split('\n')
        .map((x) => x.split(''));
    const visited = new Set();
    let bulkDiscountCost = 0;

    for (let row = 0; row < gardens.length; ++row) {
        for (let col = 0; col < gardens[0].length; ++col) {
            const { region, sides } = measure(gardens, row, col, visited);
            bulkDiscountCost += region * sides;
        }
    }

    console.log(bulkDiscountCost);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task2: ${elapsed_time} ms`);
};

task2();
