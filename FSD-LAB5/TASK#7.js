// Task 7 - Promises
// Student: Maryam Noor

function getStudent(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 101) resolve({ id: 101, name: 'Ali' });
      else reject('Student not found');
    }, 200);
  });
}

function getCourse(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === 'CS401') resolve({ code: 'CS401', seats: 2 });
      else reject('Course not found');
    }, 200);
  });
}

function checkPrerequisites(student) {
  return new Promise(resolve => setTimeout(() => resolve(true), 200));
}

function checkSeats(course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (course.seats > 0) resolve(true);
      else reject('Course full');
    }, 200);
  });
}

function registerStudent(student, course) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ studentId: student.id, course: course.code, status: 'REGISTERED' }), 200);
  });
}

function sendEmail() {
  return new Promise(resolve => setTimeout(() => resolve('Email sent'), 300));
}
function sendSMS() {
  return new Promise((_, reject) => setTimeout(() => reject('SMS failed'), 300));
}
function writeAuditLog() {
  return new Promise(resolve => setTimeout(() => resolve('Audit logged'), 300));
}

// ============ Part A: Chain ============
getStudent(101)
  .then(student => getCourse('CS401').then(course => ({ student, course })))
  .then(data => checkPrerequisites(data.student).then(() => data))
  .then(data => checkSeats(data.course).then(() => data))
  .then(data => registerStudent(data.student, data.course))
  .then(result => {
    console.log('--- Part A ---');
    console.log(result);

    // ============ Part B: allSettled ============
    return Promise.allSettled([sendEmail(), sendSMS(), writeAuditLog()]);
  })
  .then(results => {
    console.log('\n--- Part B ---');
    const names = ['Email', 'SMS', 'Audit'];
    results.forEach((r, i) => {
      console.log(names[i] + ': ' + r.status);
    });
  })
  .catch(err => console.log('Chain Error:', err))
  .finally(() => console.log('\n--- Part A+B Done ---'));

// ============ Part C: Promise.any vs race ============
const server1 = new Promise((_, rej) => setTimeout(() => rej('Server 1 down'), 300));
const server2 = new Promise(res => setTimeout(() => res('Server 2 data'), 200));
const server3 = new Promise((_, rej) => setTimeout(() => rej('Server 3 down'), 100));

// Promise.any = pehla SUCCESS
Promise.any([server1, server2, server3])
  .then(r => console.log('\n--- any() first success:', r))
  .catch(e => console.log('any() all failed'));

// Promise.race = pehla SETTLED (success ya fail)
Promise.race([server1, server2, server3])
  .then(r => console.log('--- race() first settled:', r))
  .catch(e => console.log('--- race() first settled (fail):', e));