// let myPromise = new Promise((resolve, reject) => {

//     let marks = 80;

//     if (marks >= 50) {
//         resolve("Student passed");
//     }
//     else {
//         reject("Student failed");
//     }

// });

// myPromise
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((error) => {
//         console.log(error);
//     })
//     .finally(() => {
//         console.log("Result checked");
//     });


//============================================= settime out with promise=======================
// let foodOrder = new Promise((resolve, reject) => {

//     console.log("Order received");

//     setTimeout(() => {

//         let available = true;

//         if (available) {
//             resolve("Food delivered");
//         }
//         else {
//             reject("Food unavailable");
//         }

//     }, 3000);

// });

// foodOrder
//     .then((message) => {
//         console.log(message);
//     })
//     .catch((error) => {
//         console.log(error);
//     });

// console.log("Waiting for food...");


//=================== aysnc await =========================== 

// let myPromise = new Promise((resolve, reject) => {

//     let internet = false;

//     if (internet) {
//         resolve("Internet connected");
//     }
//     else {
//         reject("No internet connection");
//     }

// });

// async function checkInternet() {

//     try {
//         let result = await myPromise;
//         console.log(result);
//     }
//     catch (error) {
//         console.log(error);
//     }

// }

// checkInternet();

//sunc task-> micro/queue task -> async rtask
// matlab k noemal con.log pehlay print ho gay us k bad promise bcz promise ko hum queue k andar dal detay hain

// console.log("A");

// let p = new Promise((resolve, reject) => {

//     resolve("B");

// });

// p.then((result) => {
//     console.log(result);
// });

// console.log("C");


// daik promise me do teh use karna :
// function getStudent() {

//     return new Promise((resolve, reject) => {

//         setTimeout(() => {
//             resolve("Ali");
//         }, 2000);

//     });
// }

// function getMarks(name) {

//     return new Promise((resolve, reject) => {

//         // setTimeout(() => {
//         //     resolve(name + " got 85 marks");
//         // }, 3000);
//         reject("second promise rejected");

//     });
// }

// getStudent()
//     .then((name) => {

//         console.log("Student name:", name);

//         return getMarks(name);

//     })
//     .then((result) => {

//         console.log(result);

//     })
//     .catch((error) => {

//         console.log(error);

//     });


//========================Promise.all() multiple Promises ko ek saath start karta hai aur tab successful result deta hai jab saare Promises resolve ho jayein.

// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("Student data received");
//     }, 2000);
// });

// let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("Marks received");
//     }, 3000);
// });

// let p3 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("Attendance received");
//     }, 1000);
// });

// Promise.all([p1, p2, p3])
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((error) => {
//         console.log(error);
//     });

//=============Agar aik Promise reject ho jaye?

// let p1 = Promise.resolve("Student received");

// let p2 = Promise.reject("Marks not found");

// let p3 = Promise.resolve("Attendance received");

// Promise.all([p1, p2, p3])
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((error) => {
//         console.log(error);
//     });


// Promise.allSettled() kya hota hai?
// Ab socho tumhare paas 3 Promises hain:
// - Pehla successful ho gaya.
// - Doosra fail ho gaya.
// - Teesra successful ho gaya.
// Tum chahte ho ke teeno ka result mile, chahe koi fail bhi ho jaye.
// Yahan Promise.allSettled() use hota hai.
// let p1 = Promise.resolve("Student received");

// let p2 = Promise.reject("Marks not found");

// let p3 = Promise.resolve("Attendance received");

// Promise.allSettled([p1, p2, p3])
//     .then((result) => {
//         console.log(result);
//     });

//========Promise.all() :: All must succeed.

// let p1 = Promise.resolve(10);
// let p2 = Promise.reject(20);
// let p3 = Promise.resolve(30);

// Promise.all([p1, p2, p3])
//     .then((result) => {
//         console.log("Success:", result);
//     })
//     .catch((error) => {
//         console.log("Error:", error);
//     });


//JavaScript execution order: Sync → Microtask → Macrotask

// console.log("1. Sync Start");

// setTimeout(() => {
//     console.log("2. SetTimeout");
// }, 0);

// Promise.resolve().then(() => {
//     console.log("3. Promise");
// });

// console.log("4. Sync End");

//===============

async function number() { return 5; }
console.log(await number());