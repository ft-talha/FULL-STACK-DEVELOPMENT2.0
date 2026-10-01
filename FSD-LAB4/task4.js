function roundMe(...args) {
    if (args.length === 0) {
        return 0;
    }
    if (args.length === 1) {
        return Math.round(args[0]);
    }

    let resultArray = [];
    for (let i = 0; i < args.length; i++) {
        resultArray.push(Math.round(args[i]));
    }
    return resultArray;
}

console.log(roundMe());             
console.log(roundMe(4.7));          
console.log(roundMe(4.7, 4.4));     