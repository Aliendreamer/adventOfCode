import path from 'path';
import { readInput, measurementWrapper } from '../helpers.mjs';

const task1 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day23', 'input.txt');
    const edges = readInput(filepath)
        .split('\n')
        .filter((x, i, arr) => !arr.some((y, j) => i > j && y.split('-').reverse().join('-') === x))
        .map((line) => line.split('-'));

    const adjacencyList = {};
    for (const [a, b] of edges) {
        if (!adjacencyList[a]) adjacencyList[a] = new Set();
        if (!adjacencyList[b]) adjacencyList[b] = new Set();
        adjacencyList[a].add(b);
        adjacencyList[b].add(a);
    }

    const triangles = new Set();
    for (const node of Object.keys(adjacencyList)) {
        const neighbors = [...adjacencyList[node]];
        for (let i = 0; i < neighbors.length; i++) {
            for (let j = i + 1; j < neighbors.length; j++) {
                const [neighbor1, neighbor2] = [neighbors[i], neighbors[j]];
                if (adjacencyList[neighbor1].has(neighbor2)) {
                    const triangle = [node, neighbor1, neighbor2].sort().join(',');
                    triangles.add(triangle);
                }
            }
        }
    }
    const filteredTriangles = [...triangles].filter((triangle) => triangle.split(',').some((node) => node.startsWith('t')));

    console.log('Total triangles:', triangles.size);
    console.log("Triangles with at least one node starting with 't':", filteredTriangles.length);
    console.log('Triangles:', filteredTriangles);
};

//  Bron-Kerbosch algorithm https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
// basically made the pseudocode from the wiki page into JS
const bronKerbosch = (R, P, X, cliques, adjacencyList) => {
    if (P.size === 0 && X.size === 0) {
        cliques.push([...R]);
        return;
    }
    for (const v of P) {
        const neighbors = adjacencyList[v] || new Set();
        bronKerbosch(
            new Set([...R, v]),
            new Set([...P].filter((x) => neighbors.has(x))),
            new Set([...X].filter((x) => neighbors.has(x))),
            cliques,
            adjacencyList
        );
        P.delete(v);
        X.add(v);
    }
};

const task2 = () => {
    const filepath = path.resolve(process.cwd(), 'adventofcode2024', 'day23', 'input.txt');
    const edges = readInput(filepath)
        .split('\n')
        .filter((x, i, arr) => !arr.some((y, j) => i > j && y.split('-').reverse().join('-') === x))
        .map((line) => line.split('-'));

    const adjacencyList = {};
    for (const [a, b] of edges) {
        if (!adjacencyList[a]) adjacencyList[a] = new Set();
        if (!adjacencyList[b]) adjacencyList[b] = new Set();
        adjacencyList[a].add(b);
        adjacencyList[b].add(a);
    }

    const allNodes = new Set(Object.keys(adjacencyList));
    const cliques = [];
    bronKerbosch(new Set(), allNodes, new Set(), cliques, adjacencyList);

    const largestClique = cliques.reduce((max, clique) => (clique.length > max.length ? clique : max), []);

    const password = largestClique.sort().join(',');

    console.log('Largest clique size:', largestClique.length);
    console.log('Largest clique:', largestClique);
    console.log('Password for the LAN party:', password);
};

// measurementWrapper(task1);
measurementWrapper(task2);
