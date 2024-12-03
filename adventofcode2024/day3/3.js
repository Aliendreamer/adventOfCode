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

const task2func = ()=>{
	const filepath= path.resolve( process.cwd(),"adventofcode2024","day3",'input.txt');
	const mulRegex = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;
	const corruptedMemory = readInput(filepath);
	return Array.from(corruptedMemory.matchAll(mulRegex)).reduce((acc,match)=>(
		{
			enabled: match[0] === "do()" ? true : match[0] === "don't()" ? false : acc.enabled,
			total: acc.enabled && match[0] !== "do()" && match[0] !== "don't()"? acc.total + (parseInt(match[1], 10) * parseInt(match[2], 10)) : acc.total
		}
	)	,{enabled:true,total:0}).total;
}

console.log(task2func());