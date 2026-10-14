// gradeUtils.js - named exports
export function calculateGrade(marks) {
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}

export function calculateAverage(courses) {
  if (courses.length === 0) return 0;
  const total = courses.reduce((sum, c) => sum + c.marks, 0);
  return total / courses.length;
}

export function calculateGPA(courses) {
  const avg = calculateAverage(courses);
  if (avg >= 85) return 4.0;
  if (avg >= 80) return 3.7;
  if (avg >= 75) return 3.3;
  if (avg >= 70) return 3.0;
  if (avg >= 65) return 2.7;
  if (avg >= 60) return 2.3;
  if (avg >= 50) return 2.0;
  return 0.0;
}