/* eslint-disable no-useless-escape */
import path from 'path';
import { readInput, measurementWrapper, isValid, drawGrid } from '../helpers.mjs';

const movements = {
    '^': [-1, 0],
    v: [1, 0],
    '<': [0, -1],
    '>': [0, 1],
};

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day15', 'input.txt');
    const info = readInput(filepath).split('\n');
    const emptyIndex = info.indexOf('');
    const matrix = info.slice(0, emptyIndex).map((row) => row.split(''));
    const rows = matrix.length;
    const cols = matrix[0].length;
    const instructions = info.slice(emptyIndex + 1).join('');
    let robotPosition = [0][0];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === '@') {
                robotPosition = [i, j];
                break;
            }
        }
    }

    const findBoxChain = (startRow, startCol, dx, dy) => {
        const chain = [];
        let currentRow = startRow;
        let currentCol = startCol;

        while (isValid(currentRow, currentCol, rows, cols) && matrix[currentRow][currentCol] === 'O') {
            chain.push([currentRow, currentCol]);
            currentRow += dx;
            currentCol += dy;
        }

        return chain;
    };

    const moveBoxes = (chain, dx, dy) => {
        for (const [row, col] of chain) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (!isValid(newRow, newCol, rows, cols) || matrix[newRow][newCol] === '#') {
                return false; // If any box in the chain cannot move, the move is invalid
            }
        }

        // Move all boxes
        for (let i = chain.length - 1; i >= 0; i--) {
            const [row, col] = chain[i];
            const newRow = row + dx;
            const newCol = col + dy;

            matrix[row][col] = '.'; // Clear current position
            matrix[newRow][newCol] = 'O'; // Move to new position
        }

        return true;
    };

    const moveRobot = (dx, dy) => {
        const [robotRow, robotCol] = robotPosition;
        const newRow = robotRow + dx;
        const newCol = robotCol + dy;

        if (!isValid(newRow, newCol, rows, cols) || matrix[newRow][newCol] === '#') {
            // Invalid move
            return;
        }

        if (matrix[newRow][newCol] === '.') {
            // Move the robot
            matrix[robotRow][robotCol] = '.';
            matrix[newRow][newCol] = '@';
            robotPosition = [newRow, newCol];
        } else if (matrix[newRow][newCol] === 'O') {
            // Attempt to push a chain of boxes
            const chain = findBoxChain(newRow, newCol, dx, dy);
            if (moveBoxes(chain, dx, dy)) {
                // If boxes moved, move the robot
                matrix[robotRow][robotCol] = '.';
                matrix[newRow][newCol] = '@';
                robotPosition = [newRow, newCol];
            }
        }
    };

    // Process instructions
    for (const instruction of instructions) {
        const [dx, dy] = movements[instruction];
        moveRobot(dx, dy);
    }
    let sum = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === 'O') {
                sum += 100 * i + j;
            }
        }
    }

    // Output the final state of the warehouse
    console.log(sum);
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day15', 'input.txt');
    const input = readInput(filepath).split(/(?:\r?\n){2}/);
    const grid = input[0]
        .replace(/\#/g, '##')
        .replace(/\O/g, '[]')
        .replace(/\./g, '..')
        .replace(/\@/g, '@.')
        .split(/\r?\n/)
        .map((x) => x.split(''));
    const moves = input[1].replace(/[\r\n]/g, '').split('');
    let x = null;
    let y = null;
    for (let i = 0; x === null && i < grid.length; ++i) {
        for (let j = 0; j < grid[0].length; ++j) {
            if (grid[i][j] === '@') {
                x = j;
                y = i;
                break;
            }
        }
    }
    for (let move of moves) {
        let [yOff, xOff] = movements[move];

        let newX = x + xOff;
        let newY = y + yOff;

        if (grid[newY][newX] === '.') {
            grid[newY][newX] = '@';
            grid[y][x] = '.';
            y = newY;
            x = newX;
            continue;
        }
        if (grid[newY][newX] === '#') {
            continue;
        }

        let [boxL_x, boxL_y, boxR_x, boxR_y] = getBoxBounds(newY, newX);

        if (shiftBox(true, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff)) {
            shiftBox(false, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff);
            grid[y][x] = '.';
            grid[newY][newX] = '@';
            y = newY;
            x = newX;
        }
        drawGrid(grid);
    }

    let result = 0;

    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[0].length; ++j) {
            if (grid[i][j] === '[') {
                result += i * 100 + j;
            }
        }
    }

    console.log(result);

    function shiftBox(dryRun, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff) {
        let q = [
            [boxL_y, boxL_x, '['],
            [boxR_y, boxR_x, ']'],
        ];
        let seen = new Set([toDp(boxL_y, boxL_x), toDp(boxR_y, boxR_x)]);

        if (!dryRun) {
            grid[boxL_y][boxL_x] = '.';
            grid[boxR_y][boxR_x] = '.';
        }

        while (q.length) {
            let [moveY, moveX, val] = q.pop();

            let newY = moveY + yOff;
            let newX = moveX + xOff;
            if (grid[newY][newX] === '.') {
                if (!dryRun) {
                    grid[newY][newX] = val;
                }
                continue;
            } else if (grid[newY][newX] === '#') {
                return false;
            } else {
                let [box2L_x, box2L_y, box2R_x, box2R_y] = getBoxBounds(newY, newX);

                if (!seen.has(toDp(box2L_y, box2L_x))) {
                    seen.add(toDp(box2L_y, box2L_x));
                    seen.add(toDp(box2R_y, box2R_x));

                    q.push([box2L_y, box2L_x, '['], [box2R_y, box2R_x, ']']);

                    if (!dryRun) {
                        grid[box2L_y][box2L_x] = '.';
                        grid[box2R_y][box2R_x] = '.';
                    }
                }
            }

            if (!dryRun) {
                grid[newY][newX] = val;
                drawGrid(grid);
            }
        }
        return true;
    }

    function toDp(x, y) {
        return y * grid[0].length + x;
    }

    function getBoxBounds(y, x) {
        let box2L_x, box2L_y, box2R_x, box2R_y;
        if (grid[y][x] === '[') {
            box2L_x = x;
            box2L_y = y;
        } else {
            box2L_x = x - 1;
            box2L_y = y;
        }
        box2R_x = box2L_x + 1;
        box2R_y = box2L_y;

        return [box2L_x, box2L_y, box2R_x, box2R_y];
    }
};

measurementWrapper(task2);
measurementWrapper(task1);
