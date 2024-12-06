import path from 'path';
import {readInput}  from '../helpers.mjs';

const task1 = () =>{
	const filepath= path.resolve( process.cwd(),"adventofcode2024","day5",'input.txt');
	const grid = readInput(filepath).split(/\n\s*\n/);
	const gridRules = grid[0].split("\n").map(rule => rule.split("|").map(Number));
	const gridPages = grid[1].split("\n").map(page => page.split(",").map(Number));
	let i =0;
	//start over the pages
	let sum = 0;
	while(i<gridPages.length){
		const page = gridPages[i];
		let pageIsOk = true;
		for(let j=0;j<page.length;j++){
			const number=page[j];
			// get the rules aplying to the page
			const rules  = gridRules.filter(rule => rule[0]===number);
			// we got the rules now check array if rule is correct for current page;
			for (const rule of rules) {
				const right=rule[1];
				//if left position we need to check if right exist and we before it
				const rightExist = page.includes(right);
				if(rightExist){
					// we need to check if the left number indexOf is less of right one
					const leftIndex = j;
					const rightIndex = page.indexOf(right);
					if(leftIndex<rightIndex){
						continue;
					}else{
						pageIsOk = false;
						break;
					}


				}
			}
		}
		if(pageIsOk){
			const middle = Math.floor(page.length/2);
			sum+=page[middle];
		}
		i++;
	}
	return sum;
}

const task2 =()=>{
	const filepath= path.resolve( process.cwd(),"adventofcode2024","day5",'input.txt');
	const grid = readInput(filepath).split(/\n\s*\n/);
	const gridRules = grid[0].split("\n").map(rule => rule.split("|").map(Number));
	const gridPages = grid[1].split("\n").map(page => page.split(",").map(Number));
	let i =0;
	//start over the pages
	let sum = 0;
	while(i<gridPages.length){
		const page = gridPages[i];
		let pageIsOk = true;
		for(let j=0;j<page.length;j++){
			const number=page[j];
			// get the rules aplying to the page
			const rules  = gridRules.filter(rule => rule[0]===number);
			// we got the rules now check array if rule is correct for current page;
			for (const rule of rules) {
				const right=rule[1];
				//if left position we need to check if right exist and we before it
				const rightExist = page.includes(right);
				if(rightExist){
					// we need to check if the left number indexOf is less of right one
					const leftIndex = page.indexOf(number);
					const rightIndex = page.indexOf(right);
					if(leftIndex<rightIndex){
						continue;
					}else{
						pageIsOk = false;
						page[leftIndex]=right;
						page[rightIndex]=number;
						j=rightIndex-1;
					}
				}
			}
		}
		if(!pageIsOk){
			const middle = Math.floor(page.length/2);
			sum+=page[middle];
		}
		i++;
	}
	return sum;
}
console.log(task2());