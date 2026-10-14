// Task 6 - Callback registration
// Student: Hassan Raza

console.log('--- Start ---');

// Har async function callback ko SIRF EK BAAR call karega
function loadStudent(id, callback) {
  setTimeout(() => {
    if (id === 101) callback(null, { id: 101, name: 'Ali', prereq: 'CS301' });
    else callback('Student not found', null);
  }, 300);
}

function checkPrerequisites(student, callback) {
  setTimeout(() => {
    if (student.prereq === 'CS301') callback(null, true);
    else callback('Prerequisite missing', null);
  }, 300);
}

function checkSeats(course, callback) {
  setTimeout(() => {
    if (course.seats > 0) callback(null, true);
    else callback('Course full', null);
  }, 300);
}

function registerCourse(studentId, code, callback) {
  setTimeout(() => {
    callback(null, { studentId: studentId, course: code, status: 'REGISTERED' });
  }, 300);
}

// Nested callbacks (callback hell)
loadStudent(101, (err, student) => {
  if (err) return console.log('Error:', err);

  checkPrerequisites(student, (err, ok) => {
    if (err) return console.log('Error:', err);

    checkSeats({ code: 'CS401', seats: 5 }, (err, ok) => {
      if (err) return console.log('Error:', err);

      registerCourse(student.id, 'CS401', (err, result) => {
        if (err) return console.log('Error:', err);
        console.log('Success:', result);
      });
    });
  });
});

/* Explanation:
   Jitne steps barhenge, utni nesting barhegi.
   Error handling har level pe karni parti hai.
   Isi ko "callback hell" kehte hain.
*/