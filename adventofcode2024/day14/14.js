import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';
import fs from 'fs';
const getQuadrants = (robots, WIDTH, HEIGHT) => {
    const quadrants = [[], [], [], []];
    const xMid = Math.floor(WIDTH / 2);
    const yMid = Math.floor(HEIGHT / 2);

    for (let robot of robots) {
        // if robot on center line, continue
        if (robot.p[0] === xMid || robot.p[1] === yMid) continue;

        if (robot.p[1] < yMid) {
            if (robot.p[0] < xMid) {
                quadrants[0].push(robot);
            } else {
                quadrants[1].push(robot);
            }
        } else if (robot.p[0] < xMid) {
            quadrants[2].push(robot);
        } else {
            quadrants[3].push(robot);
        }
    }

    return quadrants;
};

const move = (robot, times, width, height) => {
    for (let i = 0; i < times; i++) {
        robot.p[0] = (robot.p[0] + robot.v[0] + width) % width;
        robot.p[1] = (robot.p[1] + robot.v[1] + height) % height;
    }
};

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day14', 'input.txt');
    const robotsInfo = readInput(filepath).split('\n');
    const robots = robotsInfo.map((robot) => {
        const [p, v] = robot.split(' ').map((s) => s.match(/-?\d+/g).map(Number));
        return { p, v };
    });
    const WIDTH = 101;
    const HEIGHT = 103;

    robots.forEach((robot) => move(robot, 100, WIDTH, HEIGHT));
    const quadrants = getQuadrants(robots, WIDTH, HEIGHT);
    const factor = quadrants.map((q) => q.length).reduce((a, x) => a * x);
    console.log(factor);
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day14', 'input.txt');
    const robotsInfo = readInput(filepath).split('\n');
    const data = robotsInfo.map((e) => e.match(/-?\d+/g).map(Number));
    const maxX = 101;
    const maxY = 103;
    for (let tick = 1; tick < 10000; tick++) {
        const grid = Array(maxY)
            .fill(0)
            .map(() => Array(maxX).fill(0));

        for (const p of data) {
            grid[(p[1] = (p[1] + p[3] + maxY) % maxY)][(p[0] = (p[0] + p[2] + maxX) % maxX)]++;
        }

        let treeHeight = 0;
        for (let c = 0; c < maxX && treeHeight <= 10; c++)
            for (let r = 0; r < maxY && treeHeight <= 10; r++) treeHeight += grid[r][c] > 0 ? 1 : -treeHeight;

        if (treeHeight > 10) {
            fs.writeFileSync('tree.txt', grid.map((row) => row.map((cell) => (cell > 0 ? '#' : '.')).join('')).join('\n'));
            console.log('Part 2', tick);
            break;
        }
    }
};

// 225810288
// 212364912
measurementWrapper(task1);
measurementWrapper(task2);
