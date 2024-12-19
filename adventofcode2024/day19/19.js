import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const canFormDesign = (design, towelPatterns) => {
    const n = design.length;
    const dp = Array(n + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= n; i++) {
        for (const pattern of towelPatterns) {
            const patternLength = pattern.length;
            if (i >= patternLength && dp[i - patternLength]) {
                const substring = design.slice(i - patternLength, i);
                if (substring === pattern) {
                    dp[i] = true;
                    break;
                }
            }
        }
    }

    return dp[n];
};
const countWaysToFormDesign = (design, towelPatterns) => {
    const n = design.length;
    const dp = Array(n + 1).fill(0);
    dp[0] = 1;

    for (let i = 1; i <= n; i++) {
        for (const pattern of towelPatterns) {
            const patternLength = pattern.length;
            if (i >= patternLength && design.slice(i - patternLength, i) === pattern) {
                dp[i] += dp[i - patternLength];
            }
        }
    }

    return dp[n];
};

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day19', 'input.txt');
    const sections = readInput(filepath).split('\n\n');
    const towelPatterns = sections[0].split(', ').map((pattern) => pattern.trim());
    const designs = sections[1].split('\n').map((design) => design.trim());

    let possibleCount = 0;

    for (const design of designs) {
        if (canFormDesign(design, towelPatterns)) {
            possibleCount++;
        }
    }

    console.log(possibleCount);
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day19', 'input.txt');
    const sections = readInput(filepath).split('\n\n');
    const towelPatterns = sections[0].split(', ').map((pattern) => pattern.trim());
    const designs = sections[1].split('\n').map((design) => design.trim());

    let possibleCount = 0;

    for (const design of designs) {
        possibleCount += countWaysToFormDesign(design, towelPatterns);
    }

    console.log(possibleCount);
};
measurementWrapper(task1);
measurementWrapper(task2);
