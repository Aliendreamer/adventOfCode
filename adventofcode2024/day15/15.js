import path from 'path';
import { readInput, measurementWrapper, isValid } from '../helpers.mjs';

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

measurementWrapper(task1);
