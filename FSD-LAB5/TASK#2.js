const results = [
  { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
  { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
  { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

function getGrade(marks) {
  if (marks >= 85) return { grade: 'A', points: 4.0 };
  if (marks >= 80) return { grade: 'A-', points: 3.7 };
  if (marks >= 75) return { grade: 'B+', points: 3.3 };
  if (marks >= 70) return { grade: 'B', points: 3.0 };
  if (marks >= 65) return { grade: 'B-', points: 2.7 };
  if (marks >= 60) return { grade: 'C+', points: 2.3 };
  if (marks >= 50) return { grade: 'C', points: 2.0 };

  return { grade: 'F', points: 0.0 };
}

const processed = results.map(s => {
  const g = getGrade(s.marks);

  return {
    id: s.id,
    name: s.name,
    department: s.department,
    marks: s.marks,
    grade: g.grade,
    gradePoints: g.points,
    status: s.marks >= 50 ? 'PASS' : 'FAIL'
  };
});

console.log('--- Grades ---');

processed.forEach(s => {
  console.log(`${s.name} | ${s.marks} | ${s.grade} | ${s.gradePoints} | ${s.status}`);
});


const ranked = processed.slice().sort((a, b) => {
  if (a.marks !== b.marks) {
    return b.marks - a.marks;
  }

  return a.name.localeCompare(b.name);
});

console.log('\n--- Ranked Students ---');

ranked.forEach((s, i) => {
  console.log(`${i + 1}. ${s.name} - ${s.marks}`);
});


const deptStats = processed.reduce((acc, s) => {

  if (!acc[s.department]) {
    acc[s.department] = {
      students: 0,
      total: 0,
      highest: s.marks,
      passed: 0
    };
  }

  acc[s.department].students++;
  acc[s.department].total += s.marks;

  if (s.marks > acc[s.department].highest) {
    acc[s.department].highest = s.marks;
  }

  if (s.marks >= 50) {
    acc[s.department].passed++;
  }

  return acc;

}, {});

Object.keys(deptStats).forEach(d => {
  deptStats[d].average = Number(
    (deptStats[d].total / deptStats[d].students).toFixed(2)
  );

  delete deptStats[d].total;
});

console.log('\n--- Department Statistics ---');
console.log(deptStats);


const firstAbove85 = processed.find(s => s.marks > 85);

const failIndex = processed.findIndex(s => s.marks < 50);

const anyFail = processed.some(s => s.marks < 50);

const allValid = processed.every(s => s.marks >= 0 && s.marks <= 100);

const overallAvg = processed.reduce((sum, s) => sum + s.marks, 0) / processed.length;

const aboveAvg = processed.filter(s => s.marks > overallAvg);

const top3 = ranked.slice(0, 3).map(s => s.name);


console.log('\n--- Academic Queries ---');

console.log('First above 85:', firstAbove85 ? firstAbove85.name : 'None');

console.log('First fail index:', failIndex);

console.log('Any student failed?', anyFail);

console.log('All marks valid?', allValid);

console.log('Overall Average:', overallAvg.toFixed(2));

console.log('Above Average Students:', aboveAvg.map(s => s.name));

console.log('Top 3 Students:', top3);