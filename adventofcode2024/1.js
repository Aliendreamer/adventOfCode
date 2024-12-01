import fs from "fs";
import path from "path";


const task1 = (list1,list2) => {
	const orderedlist1 = [...list1].sort((a,b)=>a-b);
	const orderedlist2 = [...list2].sort((a,b)=>a-b);
	let i =0;
	let result =0;
	while(i<=orderedlist1.length-1){
        const left = orderedlist1[i];
        const right = orderedlist2[i];
		const num = Math.abs(right -left);
		result += num;
		i++;
	}
	return result;
}

const task2 = (list1,list2) => {
    const orderedlist1 = [...list1].sort((a,b)=>a-b);
    const orderedlist2 = [...list2].sort((a,b)=>a-b);

    let result ={};

    for (const element of orderedlist1) {
        if(!result[element]){
            result[element]=0;
        }
        const repeat = orderedlist2.filter((x)=>x===element).length;
        result[element] += repeat;
    }
    const resultF = Object.entries(result).reduce((acc, [key, value]) => {
        acc+= key*value;
        return acc;

    }, 0);

    return resultF;

}
const handleInput = ()=>{
    const listOne = fs.readFileSync(path.resolve(
        "adventofcode2024",'1input.txt'), 'utf8').split('\n');
        const array1 =[];
        const array2=[];
        for (const element of listOne) {
            const nums = element.split(' ').filter(Boolean).map(Number);
            array1.push(nums[0]);
            array2.push(nums[1]);
        }
        return { list1: array1, list2: array2};
}

const inputs = handleInput();
console.log(task2(inputs.list1,inputs.list2));

// console.log(task2([3,4,2,1,3,3],[4,3,5,3,9,3]));