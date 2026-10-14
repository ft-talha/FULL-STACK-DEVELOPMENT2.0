// main.js
import { processTranscript } from './transcriptService.js';

const rawData = JSON.stringify([
  {
    id: 101,
    name: 'Ali',
    courses: [
      { code: 'CS301', marks: 81 },
      { code: 'CS302', marks: 74 }
    ]
  }
]);

try {
  const result = processTranscript(rawData);
  console.log('--- Report ---');
  console.log(result);
} catch (e) {
  console.log('Error type:', e.constructor.name);
  console.log('Message:', e.message);
} finally {
  console.log('--- Done ---');
}