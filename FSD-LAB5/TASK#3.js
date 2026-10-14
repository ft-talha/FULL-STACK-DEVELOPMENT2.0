// Task 3 - Safe Profile Update
// Student: Bilal Ahmed

const student = {
  id: 101,
  name: 'Ali',
  marks: 0,
  scholarship: false,
  address: { city: 'Islamabad', sector: 'F-10' },
  contact: { email: 'ali@university.edu' }
};

const update = {
  name: 'Ali Khan',
  address: { city: 'Rawalpindi' },
  contact: { phone: '03001234567' }
};

// ============ FUNCTION ============
function updateProfile(original, changes) {
  // 1. Object destructuring (renaming + default)
  const { id, name: oldName, marks = 0, address: oldAddr = {}, contact: oldContact = {} } = original;

  // 2. Update se destructure
  const { name: newName, address: newAddr = {}, contact: newContact = {} } = changes;

  // 3. Nested destructuring
  const { city: oldCity, sector: oldSector } = oldAddr;
  const { city: newCity } = newAddr;
  const { email: oldEmail } = oldContact;
  const { phone: newPhone } = newContact;

  // 4. Array destructuring demo
  const [first, second] = [newName || oldName, oldSector];

  // 5. Rest parameters + object rest
  function makeObj(...pairs) {
    const result = {};
    pairs.forEach(p => {
      const { key, value } = p;
      result[key] = value;
    });
    return result;
  }

  // 6. Spread se naya object
  const updatedAddress = { ...oldAddr, ...newAddr };
  const updatedContact = { ...oldContact, ...newContact };

  const { city: removedCity, ...restAddress } = updatedAddress; // object rest demo

  const updated = {
    id: id,
    name: newName ?? oldName,          // nullish
    marks: marks,                      // 0 preserve
    scholarship: original.scholarship, // false preserve
    address: {
      city: newCity ?? oldCity,
      sector: oldSector
    },
    contact: {
      email: oldEmail,                 // preserve
      phone: newPhone                  // add
    }
  };

  // 7. Optional chaining demo
  const emailCheck = updated?.contact?.email ?? 'no-email';

  return { updated, emailCheck, first, restAddress };
}

// ============ RUN ============
const { updated, emailCheck } = updateProfile(student, update);

console.log('--- Original ---');
console.log(student);

console.log('\n--- Updated ---');
console.log(updated);

console.log('\n--- Email check:', emailCheck);

// Reference challenge
console.log('\n--- Reference Check ---');
console.log('Same object?', student === updated);
console.log('Same address?', student.address === updated.address);
console.log('Same contact?', student.contact === updated.contact);