const applicants = [
    { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
    { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '', entryTest: '72', program: 'BSSE', feePaid: 'false' },
    { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
    { id: 'A104', name: 'Fatima', age: '22', matricMarks: '95', intermediateMarks: '92', entryTest: '88', program: 'BSCS', feePaid: 'true' }
];

const allowedPrograms = ['BSCS', 'BSSE', 'BSAI', 'BSEE'];

function sanitize(app) {

    if (
        app.age.trim() === '' ||
        app.matricMarks.trim() === '' ||
        app.intermediateMarks.trim() === '' ||
        app.entryTest.trim() === ''
    ) {
        return { ...app, isValid: false, reason: 'Missing value' };
    }

    const age = Number(app.age);
    const matric = Number(app.matricMarks);
    const inter = Number(app.intermediateMarks);
    const entry = Number(app.entryTest);
    const feePaid = app.feePaid === 'true';

    if (
        !Number.isFinite(age) ||
        !Number.isFinite(matric) ||
        !Number.isFinite(inter) ||
        !Number.isFinite(entry)
    ) {
        return { ...app, isValid: false, reason: 'Invalid number' };
    }

    if (matric < 0 || matric > 100)
        return { ...app, isValid: false, reason: 'Invalid matric marks' };

    if (inter < 0 || inter > 100)
        return { ...app, isValid: false, reason: 'Invalid inter marks' };

    if (entry < 0 || entry > 100)
        return { ...app, isValid: false, reason: 'Invalid entry marks' };

    if (age < 17 || age > 30)
        return { ...app, isValid: false, reason: 'Invalid age' };

    if (!allowedPrograms.includes(app.program))
        return { ...app, isValid: false, reason: 'Invalid program' };

    return {
        id: app.id,
        name: app.name,
        age: age,
        matric: matric,
        inter: inter,
        entry: entry,
        program: app.program,
        feePaid: feePaid,
        isValid: true,
        reason: ''
    };
}

function getMerit(app) {
    return app.matric * 0.20 +
        app.inter * 0.30 +
        app.entry * 0.50;
}

function getStatus(app) {

    if (!app.isValid)
        return 'INVALID DATA';

    const merit = getMerit(app);

    if (merit < 70 || app.entry < 60 || app.inter < 60)
        return 'REJECTED';

    return merit >= 80 && app.entry >= 75 ? 'SELECTED' : 'WAITING';
}

function processAll(list) {

    const results = list.map(app => {

        const clean = sanitize(app);
        const status = getStatus(clean);
        const merit = clean.isValid ? getMerit(clean) : 0;

        return { ...clean, merit: merit, status: status };
    });

    const valid = results.filter(r => r.isValid);
    const invalid = results.filter(r => !r.isValid);

    const highest = valid.length > 0
        ? valid.reduce((best, r) => r.merit > best.merit ? r : best)
        : null;

    const lowest = valid.length > 0
        ? valid.reduce((worst, r) => r.merit < worst.merit ? r : worst)
        : null;

    const avgMerit = valid.length > 0
        ? valid.reduce((sum, r) => sum + r.merit, 0) / valid.length
        : 0;

    const programCount = {};

    valid.forEach(r => {
        if (programCount[r.program]) {
            programCount[r.program]++;
        } else {
            programCount[r.program] = 1;
        }
    });

    return {
        results,
        summary: {
            validCount: valid.length,
            invalidCount: invalid.length,
            highest,
            lowest,
            avgMerit,
            programCount
        }
    };
}

const output = processAll(applicants);

console.log('--- Admission Results ---');

output.results.forEach(r => {
    console.log(
        `${r.name} | Merit: ${r.merit.toFixed(2)} | Status: ${r.status}`
    );
});

console.log('\n--- Status Messages ---');

output.results.forEach(r => {

    switch (r.status) {

        case 'SELECTED':
            console.log(`${r.name}: Congratulations!`);
            break;

        case 'WAITING':
            console.log(`${r.name}: You are on the waiting list.`);
            break;

        case 'REJECTED':
            console.log(`${r.name}: Admission rejected.`);
            break;

        default:
            console.log(`${r.name}: Invalid application data.`);
    }
});

console.log('\n--- Final Summary ---');

console.log('Valid Applicants:', output.summary.validCount);
console.log('Invalid Applicants:', output.summary.invalidCount);

console.log(
    'Highest Merit:',
    output.summary.highest ? output.summary.highest.name : 'N/A'
);

console.log(
    'Lowest Merit:',
    output.summary.lowest ? output.summary.lowest.name : 'N/A'
);

console.log('Average Merit:', output.summary.avgMerit.toFixed(2));
console.log('Program Count:', output.summary.programCount);