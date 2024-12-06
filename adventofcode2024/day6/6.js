import path from 'path';
import {readInput,isValid}  from '../helpers.mjs';

const isObstruction =(position,i)=> position ==="#";
const findStartPosition =(row) => row.findIndex(x=>x==="^");
const isFreed = (position,cols,rows) => position[0]<0 || position[0]>=cols || position[1]<0 || position[1]>=rows;

const task1 = () =>{
	const filepath= path.resolve(process.cwd(),"adventofcode2024","day6",'input.txt');
	const matrix = readInput(filepath).split("\n").map(x=>x.split(""));
	const rows = matrix.length;
	const cols = matrix[0].length;
	let start=0;
	let isOut = false;
	// find the start position
	for(let i=0;i<rows;i++){
		const row = matrix[i];
		if(row.includes("^")){
			const position = findStartPosition(row);
			start =[i,position];
			console.log(start);
			break;
		}
	}
	// add first position
	const directions =new Set();
	directions.add(start.join(","));
	//calculate the moves allowed patterns;
	const patterns = [[-1,0],[0,+1],[+1,0],[0,-1]];
	let currentPattern=patterns[0];
	while(!isOut){
		let newPosition = [start[0]+currentPattern[0],start[1]+currentPattern[1]];
		//check if it is obstruction or free
		const isFree = isFreed(newPosition,cols,rows);
		const isBlocker= isValid(newPosition[0],newPosition[1],rows,cols) ? isObstruction(matrix[newPosition[0]][newPosition[1]]):false;
		if(isFree && !isBlocker){
			isOut=true;
		}
		if(isBlocker){
			//change direction
			currentPattern = patterns[(patterns.indexOf(currentPattern)+1)%4];
		}
		if(!isFree && !isBlocker){
			// if not free or it not blocker that we have to change direction update position and moves
			matrix[newPosition[0]][newPosition[1]]="P";
			directions.add(newPosition.join(","));
			start = newPosition;
		}
	}
	return directions.size;
}

const task2 = () =>{
	let stime = performance.now();

	const filepath= path.resolve(process.cwd(),"adventofcode2024","day6",'input.txt');
	const mapped = readInput(filepath).split("\n").map(x=>x.split(""));
	let result = 0;
	for (let obY = 0; obY < mapped.length; obY++) {
		for (let obX = 0; obX < mapped[obY].length; obX++) {
			if (mapped[obY][obX] == "#" || mapped[obY][obX] == "^") continue;
			const newMapped = mapped.map(x => x.map(x => x));
			newMapped[obY][obX] = "#";

			let xDirection = 0;
			let yDirection = -1;
			const areasVisited = [];
			let y = newMapped.findIndex(x => x.includes("^"));
			let x = newMapped[y].indexOf("^");

				while (x >= 0 && x < newMapped[0].length && y >= 0 && y < newMapped.length) {
					if (areasVisited.some(z => z.x == x && z.y == y && z.xDirection == xDirection && z.yDirection == yDirection)) {
						result++;
						break;
					}
					areasVisited.push({ x, y, xDirection, yDirection });
					const movedX = x + xDirection;
					const movedY = y + yDirection;
					if (movedX < 0 || movedX >= newMapped[0].length || movedY < 0 || movedY >= newMapped.length) break;
					if (newMapped[movedY][movedX] == "#") {
						if (xDirection == 0 && yDirection == -1) {
							xDirection = 1;
							yDirection = 0;
						}
						else if (xDirection == 1 && yDirection == 0) {
							xDirection = 0;
							yDirection = 1;
						}
						else if (xDirection == 0 && yDirection == 1) {
							xDirection = -1;
							yDirection = 0;
						}
						else if (xDirection == -1 && yDirection == 0) {
							xDirection = 0;
							yDirection = -1;
						}
					}
					else {
						x = movedX;
						y = movedY;
					}
				}
			}
		}
		let ftime = performance.now()
		let elapsed_time = ftime - stime;
		console.log(`Execution time: ${elapsed_time} ms`);
	return result;
}

//4977
console.log(task2());