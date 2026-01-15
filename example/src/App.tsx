/**
 * Example app demonstrating mini-jotai usage
 * 
 * This file shows various patterns for using atoms.
 * Once you implement the core functionality, these examples should work!
 */

import { Provider } from 'mini-jotai';
import { CounterExample } from './examples/CounterExample';
import { DerivedAtomExample } from './examples/DerivedAtomExample';
import { TodoExample } from './examples/TodoExample';

export function App() {
  return (
    <Provider>
      <div>
        <h1>🧪 Mini Jotai - Learning Implementation</h1>
        
        <div className="warning-box">
          <strong>⚠️ Implementation Required</strong>
          <p>
            The examples below will throw errors until you implement the core functionality.
            Start by implementing the atom() function, then the Store class, then the React hooks.
          </p>
        </div>

        <div className="info-box">
          <strong>📚 Learning Path</strong>
          <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Implement <code>atom()</code> in src/atom.ts</li>
            <li>Implement <code>Store</code> class in src/store.ts</li>
            <li>Implement <code>useAtom</code> and related hooks in src/hooks.ts</li>
            <li>Implement <code>Provider</code> component in src/Provider.tsx</li>
            <li>Test with the examples below!</li>
          </ol>
        </div>

        {/* Uncomment these as you implement the functionality */}
        
        {/* <CounterExample /> */}
        
        {/* <DerivedAtomExample /> */}
        
        {/* <TodoExample /> */}

        <div className="example-section">
          <h2>🎯 Next Steps</h2>
          <p>
            Uncomment the example components above one by one as you implement the functionality.
            Each example demonstrates different aspects of Jotai:
          </p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: '#666' }}>
            <li><strong>CounterExample</strong>: Basic primitive atoms and useAtom</li>
            <li><strong>DerivedAtomExample</strong>: Read-only and writable derived atoms</li>
            <li><strong>TodoExample</strong>: Complex state management with multiple atoms</li>
          </ul>
        </div>
      </div>
    </Provider>
  );
}

