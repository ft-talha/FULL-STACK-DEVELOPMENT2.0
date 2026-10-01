
// let names = ["talha", "iraj", 4, "irha"]
// for (const name of names) {
//     console.log(name);
// }
// console.log("===============================================");

// let student = {
//     name: "Talha",
//     age: 21,
//     address: {
//         city: "Islamabad",
//         country: "Pakistan"
//     }
// };

// for (const key in student) {
//     console.log(key, student[key]);
// }

// for (const key in student.address) {
//     console.log(key, student.address[key]);
// }

// console.log("===============================================");


// let students = [
//     {
//         name: "Talha",
//         age: 21
//     },
//     {
//         name: "Ali",
//         age: 20
//     },
//     {
//         name: "Ahmed",
//         age: 22
//     }
// ];

// for (const student of students) {
//     console.log("the name of student is: "+student.name);
//     console.log("the age of the student is: "+student.age);
// }

// console.log("===============================================");
// function add(a,...numbers) {
//     let total = 0;

//         console.log("my name is ",a);
//     for (const number of numbers) {
//         total = total + number;
//     }

//     console.log(total);
// }

// add("talha",10, 20, 30, 40);


// function func(){return "hello from 1"}
// function func(){return "hello from 2"}

// console.log(func());// agar ai name k do function banain gay to jo bad me banay ga wo wala call hoga pehlay wala hide ho jai ga



function func(a){return "hello from 1"}
function func(a){return "hello from 2 "+a}

console.log(func());