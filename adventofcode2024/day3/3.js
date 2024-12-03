import path from 'path';
import {readInput}  from '../helpers.mjs';

const task1 = () => {
	const filepath= path.resolve( process.cwd(),"adventofcode2024","day3",'input.txt');
	const memory = readInput(filepath);
	const regex = /mul\((\d+),(\d+)\)/g;

	let match;
	let total = 0;

	// Loop through all matches in the corrupted memory
	while ((match = regex.exec(memory)) !== null) {
	  // Extract the numbers and calculate their product
	  const num1 = parseInt(match[1], 10);
	  const num2 = parseInt(match[2], 10);
	  total += num1 * num2;
	}
	return total;
}

const task2 = ()=>{
		const filepath= path.resolve( process.cwd(),"adventofcode2024","day3",'input.txt');
		const corruptedMemory = readInput(filepath);
		const mulRegex = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;
	    const instructions = Array.from(corruptedMemory.matchAll(mulRegex));

		let total = 0;
		let enabled = true;
		for (const match of instructions) {
			if(match[0] === "do()"){
				enabled = true;
				continue;
			}
			if(match[0] === "don't()"){
				enabled = false;
				continue;
			}
			if(!enabled){
				continue;
			}
			const num1 = parseInt(match[1], 10);
			const num2 = parseInt(match[2], 10);
			total += num1 * num2;
		}
		return total;
}
console.log(task2());