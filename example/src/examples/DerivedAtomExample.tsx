/**
 * Derived atoms example
 * 
 * This demonstrates:
 * - Read-only derived atoms that compute from other atoms
 * - Writable derived atoms with custom write logic
 * - Dependency tracking between atoms
 */

import { atom, useAtom, useAtomValue } from 'mini-jotai';

// Base atoms
const firstNameAtom = atom('John');
const lastNameAtom = atom('Doe');

// Read-only derived atom - computes from other atoms
const fullNameAtom = atom((get) => {
  const firstName = get(firstNameAtom);
  const lastName = get(lastNameAtom);
  return `${firstName} ${lastName}`;
});

// Writable derived atom - custom read and write logic
const upperCaseNameAtom = atom(
  (get) => get(fullNameAtom).toUpperCase(),
  (get, set, newName: string) => {
    // When writing, split the name and update both atoms
    const [first, last] = newName.split(' ');
    set(firstNameAtom, first || '');
    set(lastNameAtom, last || '');
  }
);

function NameEditor() {
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);

  return (
    <div>
      <h3>Edit Name</h3>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First name"
      />
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last name"
      />
    </div>
  );
}

function DerivedDisplay() {
  const fullName = useAtomValue(fullNameAtom);
  const upperName = useAtomValue(upperCaseNameAtom);

  return (
    <div className="info-box">
      <p><strong>Full Name:</strong> {fullName}</p>
      <p><strong>Uppercase:</strong> {upperName}</p>
    </div>
  );
}

function WritableDerivedEditor() {
  const [upperName, setUpperName] = useAtom(upperCaseNameAtom);

  return (
    <div>
      <h3>Edit via Derived Atom</h3>
      <p>Type a full name (first and last) to update both atoms at once:</p>
      <input
        value={upperName}
        onChange={(e) => setUpperName(e.target.value)}
        placeholder="FIRST LAST"
        style={{ width: '300px' }}
      />
    </div>
  );
}

export function DerivedAtomExample() {
  return (
    <div className="example-section">
      <h2>2️⃣ Derived Atoms</h2>
      <p>
        Derived atoms compute their values from other atoms. They automatically
        update when their dependencies change.
      </p>
      
      <NameEditor />
      <DerivedDisplay />
      <WritableDerivedEditor />
      
      <div className="info-box" style={{ marginTop: '1rem' }}>
        <strong>💡 Key Concept:</strong> The <code>fullNameAtom</code> and{' '}
        <code>upperCaseNameAtom</code> don't store values themselves - they
        compute them from <code>firstNameAtom</code> and <code>lastNameAtom</code>.
        When you edit via the writable derived atom, it updates the base atoms.
      </div>
    </div>
  );
}

