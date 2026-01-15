/**
 * Basic counter example using primitive atoms
 * 
 * This demonstrates:
 * - Creating a primitive atom with atom(initialValue)
 * - Using useAtom to read and write the atom
 * - Using useAtomValue to only read
 * - Using useSetAtom to only write
 */

import { atom, useAtom, useAtomValue, useSetAtom } from 'mini-jotai';

// Create a primitive atom with initial value 0
const countAtom = atom(0);

// Component that reads and writes the count
function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <div className="counter-display">{count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Component that only reads the count (won't cause re-renders when writing)
function CountDisplay() {
  const count = useAtomValue(countAtom);
  
  return (
    <div className="info-box">
      <strong>Read-only view:</strong> {count}
    </div>
  );
}

// Component that only writes (won't re-render when count changes)
function CountControls() {
  const setCount = useSetAtom(countAtom);
  
  return (
    <div>
      <p>These buttons don't cause this component to re-render:</p>
      <button onClick={() => setCount((c) => c + 10)}>+10</button>
      <button onClick={() => setCount((c) => c - 10)}>-10</button>
    </div>
  );
}

export function CounterExample() {
  return (
    <div className="example-section">
      <h2>1️⃣ Basic Counter (Primitive Atom)</h2>
      <p>
        This example uses a primitive atom created with <code>atom(0)</code>.
        Multiple components can read and write the same atom.
      </p>
      
      <Counter />
      <CountDisplay />
      <CountControls />
    </div>
  );
}

