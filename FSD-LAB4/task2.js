let givenPrime = 11;
let nextNumber = givenPrime + 1;

while (true) {
    let isPrime = true;


    for (let i = 2; i < nextNumber; i++) {
        if (nextNumber % i === 0) {
            isPrime = false;
            break;
        }
    }


    if (isPrime) {
        console.log("Given Prime Number: " + givenPrime);
        console.log("Prime Number after " + givenPrime + ": " + nextNumber);
        break;
    }

    nextNumber++;
}

