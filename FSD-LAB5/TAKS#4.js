// Task 4 - User Hierarchy
// Student: Hamza Tariq

// Parent
class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  introduce() {
    return `Hi, I am ${this.name} (${this.email}).`;
  }
}

// Student
class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks = marks;
  }
  introduce() {
    return `${super.introduce()} I am a student, Roll No: ${this.rollNo}.`;
  }
  getResult() {
    return this.marks >= 50 ? 'PASS' : 'FAIL';
  }
}

// Faculty
class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }
  introduce() {
    return `${super.introduce()} I teach in ${this.department}.`;
  }
}

// Objects
const s1 = new Student('Ayesha', 'ayesha@uni.edu', 'S101', 78);
const s2 = new Student('Usman', 'usman@uni.edu', 'S102', 45);
const f1 = new FacultyMember('Dr. Ahmed', 'ahmed@uni.edu', 'E201', 'CS');
const f2 = new FacultyMember('Dr. Fatima', 'fatima@uni.edu', 'E202', 'AI');

const users = [s1, s2, f1, f2];

// Polymorphism
console.log('--- Introduce ---');
users.forEach(u => console.log(u.introduce()));

// instanceof
console.log('\n--- instanceof ---');
console.log('s1 Student?', s1 instanceof Student);
console.log('s1 Person?', s1 instanceof Person);
console.log('f1 Faculty?', f1 instanceof FacultyMember);
console.log('f1 Person?', f1 instanceof Person);

// this / call
const guest = { name: 'Dr. Ahmed', email: 'ahmed@example.com' };
const personIntro = Person.prototype.introduce;

console.log('\n--- call() ---');
console.log(personIntro.call(guest));

// Detached method
console.log('\n--- Detached ---');
const fn = s1.introduce;
try {
  console.log(fn());
} catch (e) {
  console.log('Error:', e.message);
}

// bind
console.log('\n--- bind() ---');
const boundFn = s1.introduce.bind(s1);
console.log(boundFn());