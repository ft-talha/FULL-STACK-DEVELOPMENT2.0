function absMe(...args) {
    if (args.length === 0) {
        return 0;
    }
    if (args.length === 1) {
        return Math.abs(args[0]);
    }
    let resultArray = [];
    for (let i = 0; i < args.length; i++) {
        resultArray.push(Math.abs(args[i]));
    }
    return resultArray;
}


function ceilMe(...args) {
    if (args.length === 0) {
        return 0;
    }
    if (args.length === 1) {
        return Math.ceil(args[0]);
    }
    let resultArray = [];
    for (let i = 0; i < args.length; i++) {
        resultArray.push(Math.ceil(args[i]));
    }
    return resultArray;
}


function floorMe(...args) {
    if (args.length === 0) {
        return 0;
    }
    if (args.length === 1) {
        return Math.floor(args[0]);
    }
    let resultArray = [];
    for (let i = 0; i < args.length; i++) {
        resultArray.push(Math.floor(args[i]));
    }
    return resultArray;
}


console.log(absMe(-4.7, 3.2));      
console.log(ceilMe(4.1));           
console.log(floorMe(4.9, 2.1));     