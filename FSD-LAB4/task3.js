function createPhoneNumber(numbers) {
    let areaCode = numbers.slice(0, 3).join('');
    let middlePart = numbers.slice(3, 6).join('');
    let lastPart = numbers.slice(6, 10).join('');

    return "(" + areaCode + ") " + middlePart + "-" + lastPart;
}

let sampleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
console.log(createPhoneNumber(sampleNumbers)); 
