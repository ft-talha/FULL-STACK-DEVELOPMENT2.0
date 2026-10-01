function sumOfMultiples(x, y, z) {
    let totalSum = 0;

    for (let i = 1; i < z; i++) {
        if (i % x === 0 || i % y === 0) {
            totalSum += i;
        }
    }

    return totalSum;
}


let xVal = 3;
let yVal = 5;
let zVal = 10;

let resultSum = sumOfMultiples(xVal, yVal, zVal);
console.log("Sum of multiples of " + xVal + " or " + yVal + " below " + zVal + " is: " + resultSum);
