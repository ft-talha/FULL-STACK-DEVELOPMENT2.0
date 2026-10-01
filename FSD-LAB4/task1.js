var myName = "Ali Khan";
var myAge = 20;
var isStudent = true;
var myGpa = 3.65;
var myCity = "Lahore";

console.log("My Biography");
console.log("Name: " + myName);
console.log("Age: " + myAge);
console.log("Is Student: " + isStudent);
console.log("GPA: " + myGpa);
console.log("City: " + myCity);

var myBioObject = {
    name: "Ali Khan",
    age: 20,
    isEnrolled: true,
    address: {
        street: "Street 5, Sector H-8",
        city: "Islamabad",
        country: "Pakistan"
    },
    degreeProgram: {
        title: "BS Computer Science",
        university: "FAST NUCES",
        currentSemester: 3
    }
};

console.log("My Biography");
console.log("Name: " + myBioObject.name);
console.log("Age: " + myBioObject.age);
console.log("Status: " + (myBioObject.isEnrolled ? "Enrolled" : "Not Enrolled"));
console.log("Address: " + myBioObject.address.street + ", " + myBioObject.address.city + ", " + myBioObject.address.country);
console.log("Degree Program: " + myBioObject.degreeProgram.title + " at " + myBioObject.degreeProgram.university + " (Semester " + myBioObject.degreeProgram.currentSemester + ")");
