// let a = [1, 2, 3, 4, 5, 6, 7, 8];

// // 1. Changed index(7) to a.indexOf(7)
// console.log(a, a.indexOf(7)); 

// // 2. Added parentheses around (Mark, index)
// a.forEach((Mark, index) => console.log(Mark, " ", index));

// // Example 1: Filter numbers greater than 4
// let greaterThanFour = a.filter((item) => item > 4);
// console.log(greaterThanFour); 
// // Output: [5, 6, 7, 8] filter array ko chnage nai karta

// let doubled = a.map((item) => item * 2);
// console.log(doubled);// map b array ko chnage nai karta


// // Example 1: Sum all numbers in the array
// let sum = a.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
// console.log(sum);// return a single value

// let hasGreaterThanSeven = a.some((item) => item > 7);
// console.log(hasGreaterThanSeven);// BATATA HAI K KOI AISI VALUE JO 7 SE BARI HO , FILTER EXACT VALUE BATI GA SOME TURE FALSE BTAI GA

// // Example 1: Check if ALL numbers are positive
// let allPositive = a.every((item) => item > 0);
// console.log(allPositive); // sb ko karna chaiya
// // Output: true

// //TRICKY
// console.log([].some(item => item > 0));  // Output: false
// console.log([].every(item => item > 0)); // Output: true KOI AISI VALUE NAI DHOND PA RAHA IS LIYA TRUE KAR DIYA

// let marks = [23, 21, 34, 12, 13, 43];
// console.log( marks.find(mark=>mark>20)); // error

// is ka answer code filelesson js array and method me given hai 
// marks.forEach(m => console.log(`${m > 20} ${m}`));


//==========SORT=================
// console.log([100,5,20,3].sort());// lexagraphicall arrange

// // Ascending (Small to Large)
// marks.sort((a, b) => a - b);
// console.log(marks); 
// // Output: [12, 13, 21, 23, 34, 43]

// // Descending (Large to Small)
// marks.sort((a, b) => b - a);
// console.log(marks); 
// // Output: [43, 34, 23, 21, 13, 12]

// object====================================

// const student = { id: 1, name: "talha", marks: 23 }

// console.log(student.name, student.id, student['marks']);

// student.age = 20;
// // or: student['age'] = 20;
// console.log(student);
// // Output: { id: 1, name: 'talha', marks: 23, age: 20 }

// // 2. DELETE a key
// delete student.marks;
// // or: delete student['marks'];
// console.log(student);

// student.greet = (name) => `Hello ${name}!`;

// console.log(student.greet("Talha"));
// // object destructuring is vip

//spread and rest ops
let marks = [23, 21, 34];

console.log(...marks); 
// Output: 23 21 34 (Array hat gaya, values alag ho gayi)

let copyMarks = [...marks, 99]; 
// Output: [23, 21, 34, 99] (Purani array khol kar naye mein daal di)