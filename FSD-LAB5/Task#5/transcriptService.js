// transcriptService.js
import Student from './Student.js';
import { calculateAverage, calculateGPA, calculateGrade as getGrade } from './gradeUtils.js';

export function processTranscript(rawJSON) {
  // 1. Safe JSON parse
  let data;
  try {
    data = JSON.parse(rawJSON);
  } catch (e) {
    throw new SyntaxError('Malformed JSON');
  }

  if (!Array.isArray(data)) throw new TypeError('Array expected');

  // 2. Duplicate IDs
  const seen = new Set();
  data.forEach(s => {
    if (!s.id) throw new TypeError('Missing ID');
    if (seen.has(s.id)) throw new RangeError('Duplicate ID: ' + s.id);
    seen.add(s.id);
  });

  // 3. Report
  const report = data.map(s => {
    if (!Array.isArray(s.courses)) throw new TypeError('No courses for ' + s.id);

    s.courses.forEach(c => {
      if (!c.code) throw new TypeError('Missing course code');
      if (typeof c.marks !== 'number' || c.marks < 0 || c.marks > 100) {
        throw new RangeError('Bad marks: ' + c.code);
      }
    });

    const studentObj = new Student(s.id, s.name, s.courses);
    const avg = calculateAverage(studentObj.courses);
    const gpa = calculateGPA(studentObj.courses);

    return {
      id: studentObj.id,
      name: studentObj.name,
      average: avg.toFixed(2),
      gpa: gpa,
      courses: studentObj.courses.map(c => ({
        code: c.code,
        marks: c.marks,
        grade: getGrade(c.marks)
      }))
    };
  });

  return JSON.stringify(report, null, 2);
}