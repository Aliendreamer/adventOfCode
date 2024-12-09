import path from 'path';
import { readInput } from '../helpers.mjs';

const createDiskMap = (numbers) => {
    let disk = [];
    let fileId = 0;

    for (let i = 0; i < numbers.length; i++) {
        const length = numbers[i];

        if (i % 2 === 0) {
            for (let j = 0; j < length; j++) {
                disk.push(fileId);
            }
            fileId++;
        } else {
            for (let j = 0; j < length; j++) {
                disk.push('.');
            }
        }
    }

    return disk;
};

const findFiles = (disk) => {
    const files = new Map();

    for (let i = 0; i < disk.length; i++) {
        const id = disk[i];
        if (id === '.') continue;

        if (!files.has(id)) {
            files.set(id, {
                id,
                start: i,
                length: 1,
            });
        } else {
            files.get(id).length++;
        }
    }

    return Array.from(files.values());
};

const findFreeSpace = (disk, start, length) => {
    let currentLength = 0;
    let currentStart = -1;

    for (let i = 0; i < start; i++) {
        if (disk[i] === '.') {
            if (currentStart === -1) currentStart = i;
            currentLength++;

            if (currentLength === length) {
                return currentStart;
            }
        } else {
            currentLength = 0;
            currentStart = -1;
        }
    }

    return -1;
};

const moveFile = (disk, file, newStart) => {
    for (let i = file.start; i < file.start + file.length; i++) {
        disk[i] = '.';
    }

    for (let i = 0; i < file.length; i++) {
        disk[newStart + i] = file.id;
    }
};

const compactDisk = (disk) => {
    const files = findFiles(disk);
    files.sort((a, b) => b.id - a.id);

    for (const file of files) {
        const newPos = findFreeSpace(disk, file.start, file.length);
        if (newPos !== -1) {
            moveFile(disk, file, newPos);
        }
    }
    return disk;
};

const compactDisk1 = (disk) => {
    let cycle = true;
    while (cycle) {
        const firstGap = disk.indexOf('.');
        if (firstGap === -1) break;

        let lastFilePos = disk.length - 1;
        while (lastFilePos >= 0 && disk[lastFilePos] === '.') {
            lastFilePos--;
        }

        if (lastFilePos <= firstGap) {
            cycle = false;
        }

        disk[firstGap] = disk[lastFilePos];
        disk[lastFilePos] = '.';
    }

    return disk;
};
const task1 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day9', 'input.txt');
    const numbers = readInput(filepath).trim().split('').map(Number);
    const disk = createDiskMap(numbers);
    const compactedDisk = compactDisk1([...disk]);
    const values = compactedDisk.reduce((sum, fileId, pos) => {
        if (fileId === '.') return sum;
        return sum + pos * fileId;
    }, 0);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(values);
    console.log(`Execution time task1: ${elapsed_time} ms`);
};

const task2 = () => {
    let stime = performance.now();
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day9', 'input.txt');
    const diskMap = readInput(filepath).trim().split('').map(Number);

    const disk = createDiskMap(diskMap);
    const compactedDisk = compactDisk([...disk]);
    const values = compactedDisk.reduce((sum, fileId, pos) => {
        if (fileId === '.') return sum;
        return sum + pos * fileId;
    }, 0);
    console.log(values);
    let ftime = performance.now();
    let elapsed_time = ftime - stime;
    console.log(`Execution time task1: ${elapsed_time} ms`);
};
task1();
task2();
