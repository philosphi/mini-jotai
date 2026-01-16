# Blog Post: "How Jotai Tracks Dependencies: A Deep Dive into the Source Code"

## Target Audience
Senior/mid-level developers interested in:
- State management internals
- Reactive programming patterns
- Performance optimization techniques
- Reading and understanding production codebases

## Estimated Length
2,500-3,500 words (10-15 minute read)

---

## Outline

### 1. Introduction (300 words)
**Hook:** "When you write `atom((get) => get(countAtom) * 2)`, something magical happens. Jotai knows exactly when to recompute this atom, and only when necessary. How?"

**Setup the problem:**
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const quadAtom = atom((get) => get(doubleAtom) * 2);
const sumAtom = atom((get) => get(countAtom) + get(doubleAtom));

// When countAtom changes, which atoms need to recompute?
// In what order?
// How does Jotai know?
```

**Key questions to answer:**
- How does Jotai track which atoms depend on which?
- How does it propagate changes efficiently?
- How does it avoid unnecessary recomputations?
- What can we learn from the implementation?

**Transition:** "Let's dive into the actual Jotai source code to find out."

---

### 2. The Naive Approach (and Why It Fails) (400 words)

**Start with the obvious solution:**
```typescript
// Naive approach: Just recompute everything
function set(atom, value) {
  atomState.value = value;
  
  // Recompute ALL atoms? 😱
  for (const otherAtom of allAtoms) {
    recompute(otherAtom);
  }
}
```

**Problems:**
1. **Performance:** Recomputing atoms that didn't change
2. **Correctness:** What if an atom doesn't depend on the changed atom?
3. **Order:** What if atom A depends on atom B which depends on atom C?

**Better idea: Track dependencies**
```typescript
// We need to know:
// - Which atoms does doubleAtom depend on? (countAtom)
// - Which atoms depend on countAtom? (doubleAtom, sumAtom)
```

**The challenge:**
- Dependencies are dynamic (determined at runtime)
- Dependencies can change (conditional reads)
- Need to track both directions (dependencies AND dependents)

**Transition:** "This is exactly what Jotai does. Let's see how."

---

### 3. Jotai's Solution: The Dependency Graph (600 words)

**Core data structure (from real Jotai source):**
```typescript
type AtomState<Value> = {
  // Dependencies: atoms this one reads from
  d: Map<AnyAtom, EpochNumber>
  
  // Pending promises (for async atoms)
  p: Set<AnyAtom>
  
  // Epoch number (version counter)
  n: EpochNumber
  
  // Current value
  v?: Value
  
  // Error if read threw
  e?: AnyError
}

type Mounted = {
  // Listeners (React components)
  l: Set<() => void>
  
  // Mounted dependencies
  d: Set<AnyAtom>
  
  // Mounted dependents (reverse dependencies)
  t: Set<AnyAtom>
  
  // Unmount cleanup
  u?: () => void
}
```

**Key insight #1: Two-way tracking**
- `atomState.d` tracks dependencies (forward)
- `mounted.t` tracks dependents (backward)
- Both are needed for efficient updates

**Key insight #2: Epoch numbers instead of value comparison**
```typescript
// Instead of:
if (oldValue !== newValue) { /* changed */ }

// Jotai uses:
if (oldEpochNumber !== newEpochNumber) { /* changed */ }
```

**Why epoch numbers?**
- Works with any value type (objects, arrays, etc.)
- No need for deep equality checks
- Explicit versioning
- Can detect changes even if value is the same object

**Visual: Dependency graph diagram**
[Include the Mermaid diagram showing countAtom → doubleAtom → quadAtom]

**Code walkthrough: How dependencies are tracked**
```typescript
// From Jotai's readAtomState function
function getter<V>(a: Atom<V>) {
  if (a === atom) {
    // Reading self - special case
    return returnAtomValue(ensureAtomState(store, a));
  }
  
  // Reading another atom
  const aState = readAtomState(store, a);
  
  // 🔑 KEY: Record the dependency!
  atomState.d.set(a, aState.n);  // Forward: "I depend on a"
  
  // 🔑 KEY: Record the dependent!
  if (mountedMap.has(atom)) {
    mountedMap.get(a)?.t.add(atom);  // Backward: "a has me as dependent"
  }
  
  return returnAtomValue(aState);
}
```

**Transition:** "Now that we know how dependencies are tracked, let's see how changes propagate."

---

### 4. Change Propagation: The Invalidation Algorithm (700 words)

**The process when an atom changes:**
1. Update the atom's value
2. Increment its epoch number
3. Find all dependents
4. Mark them as "invalidated"
5. Recompute them in the correct order
6. Notify listeners

**Step 1-2: Update and version bump**
```typescript
// From setAtomStateValueOrPromise
atomState.v = valueOrPromise;
delete atomState.e;

if (!hasPrevValue || !Object.is(prevValue, atomState.v)) {
  ++atomState.n;  // 🔑 Increment epoch number
}
```

**Step 3-4: Invalidate dependents (BFS)**
```typescript
// From invalidateDependents
const stack: AnyAtom[] = [atom];

while (stack.length) {
  const a = stack.pop()!;
  const aState = ensureAtomState(store, a);
  
  // Get all atoms that depend on 'a'
  for (const dependent of getMountedOrPendingDependents(a, aState, mountedMap)) {
    const dState = ensureAtomState(store, dependent);
    
    // Mark as invalidated at current epoch
    invalidatedAtoms.set(dependent, dState.n);
    
    // Recursively invalidate ITS dependents
    stack.push(dependent);
  }
}
```

**Visual: Invalidation wave diagram**
[Include the Mermaid diagram showing invalidation propagation]

**Step 5: Recompute in topological order**

**The challenge:** Given this dependency graph:
```
countAtom → doubleAtom → quadAtom
         ↘ sumAtom ↗
```

We need to recompute in order: `countAtom`, then `doubleAtom`, then `quadAtom` and `sumAtom`.

**Jotai's solution: Topological sort via DFS**
```typescript
// From recomputeInvalidatedAtoms (simplified)
const topSortedReversed: [atom: AnyAtom, atomState: AtomState][] = [];
const visiting = new WeakSet<AnyAtom>();
const visited = new WeakSet<AnyAtom>();

const stack: AnyAtom[] = Array.from(changedAtoms);

while (stack.length) {
  const a = stack[stack.length - 1]!;
  const aState = ensureAtomState(store, a);
  
  if (visited.has(a)) {
    stack.pop();
    continue;
  }
  
  if (visiting.has(a)) {
    // All dependents processed, add to sorted list
    if (invalidatedAtoms.get(a) === aState.n) {
      topSortedReversed.push([a, aState]);
    }
    visited.add(a);
    stack.pop();
    continue;
  }
  
  visiting.add(a);
  
  // Push unvisited dependents onto stack
  for (const d of getMountedOrPendingDependents(a, aState, mountedMap)) {
    if (!visiting.has(d)) {
      stack.push(d);
    }
  }
}

// Recompute in reverse order (dependencies first)
for (let i = topSortedReversed.length - 1; i >= 0; --i) {
  const [a, aState] = topSortedReversed[i]!;
  
  // Check if dependencies actually changed
  let hasChangedDeps = false;
  for (const dep of aState.d.keys()) {
    if (dep !== a && changedAtoms.has(dep)) {
      hasChangedDeps = true;
      break;
    }
  }
  
  if (hasChangedDeps) {
    readAtomState(store, a);  // Recompute
    mountDependencies(store, a);  // Update dependency tracking
  }
  
  invalidatedAtoms.delete(a);
}
```

**Key optimizations:**
1. **Skip unchanged atoms:** Check if dependencies actually changed
2. **Topological order:** Compute dependencies before dependents
3. **Single pass:** Each atom recomputed at most once
4. **Lazy evaluation:** Only recompute mounted atoms

**Step 6: Notify listeners**
```typescript
// From flushCallbacks
const callbacks = new Set<() => void>();
changedAtoms.forEach((atom) => 
  mountedMap.get(atom)?.l.forEach(callbacks.add.bind(callbacks))
);
callbacks.forEach(call);
```

---

### 5. Performance Implications (500 words)

**Time complexity analysis:**

**Reading an atom: O(D)**
- D = number of dependencies
- Each dependency read is O(1) (WeakMap lookup)
- Total: O(D)

**Writing an atom: O(N + E)**
- N = number of affected atoms
- E = number of edges in dependency subgraph
- Invalidation: O(N) BFS
- Topological sort: O(N + E) DFS
- Recomputation: O(N × D_avg)

**Space complexity:**
- Per atom: O(D + T) where T = number of dependents
- Total: O(A × (D + T)) where A = number of atoms
- WeakMap allows garbage collection of unused atoms

**Comparison with other approaches:**

| Approach | Read | Write | Memory |
|----------|------|-------|--------|
| Naive (recompute all) | O(1) | O(A) | O(A) |
| Jotai (dependency graph) | O(D) | O(N+E) | O(A×D) |
| MobX (observables) | O(D) | O(N) | O(A×D) |
| Recoil (similar to Jotai) | O(D) | O(N+E) | O(A×D) |

**When Jotai shines:**
- Many atoms with sparse dependencies
- Frequent reads, infrequent writes
- Deep dependency chains
- Conditional dependencies

**When it struggles:**
- Dense dependency graphs (everything depends on everything)
- Very frequent writes
- Extremely large number of atoms (memory pressure)

**Real-world performance:**
```typescript
// Example: 1000 atoms, average 3 dependencies each
// Write to one atom affecting 10 dependents
// 
// Naive: Recompute 1000 atoms
// Jotai: Recompute 10 atoms
// 
// 100x improvement! 🚀
```

---

### 6. Lessons for Library Authors (400 words)

**Design principles from Jotai:**

**1. Separate definition from execution**
```typescript
// Atom is just a config object
const atom = { read: (get) => get(other) * 2 };

// Store executes it
const value = store.get(atom);
```

**Benefits:**
- Atoms are serializable (can be compared with ===)
- Easy to test (just functions)
- No hidden state in atoms themselves

**2. Use WeakMap for automatic cleanup**
```typescript
const atomStateMap = new WeakMap<Atom, AtomState>();
```

**Benefits:**
- Atoms can be garbage collected
- No manual cleanup needed
- Prevents memory leaks

**3. Version numbers over value comparison**
```typescript
// Instead of deep equality
if (oldEpochNumber !== newEpochNumber) { /* changed */ }
```

**Benefits:**
- Works with any value type
- O(1) comparison
- Explicit change tracking

**4. Lazy evaluation**
```typescript
// Only compute when needed
if (mountedMap.has(atom)) {
  readAtomState(store, atom);
}
```

**Benefits:**
- Don't compute unused atoms
- Better performance
- Lower memory usage

**5. Bidirectional relationships**
```typescript
// Track both directions
atomState.d.set(dependency, version);  // Forward
mounted.t.add(dependent);  // Backward
```

**Benefits:**
- Efficient invalidation (backward)
- Efficient recomputation (forward)
- Complete dependency graph

---

### 7. Conclusion (300 words)

**Summary of key insights:**
1. Dependency tracking happens during read via the `getter` function
2. Epoch numbers provide efficient change detection
3. Topological sort ensures correct recomputation order
4. WeakMap enables automatic garbage collection
5. The design balances simplicity and performance

**What makes Jotai's approach elegant:**
- Simple API hides complex implementation
- Automatic dependency tracking (no manual subscriptions)
- Optimal recomputation (only what changed)
- Memory efficient (garbage collection)
- Type-safe (full TypeScript support)

**Further exploration:**
- Async atoms and Suspense integration
- Atom families and dynamic atoms
- DevTools and debugging
- Comparison with Recoil, Zustand, Redux

**Call to action:**
- Read the full Jotai source: [link]
- Try building your own mini-jotai: [link to your repo]
- Explore the dependency graph in DevTools
- Share your insights!

**Final thought:**
"The best way to understand a library is to build it yourself. Jotai's source code is surprisingly readable—I encourage you to explore it. You'll find elegant solutions to complex problems, and learn patterns you can apply in your own code."

---

## Code Examples to Include

1. ✅ Basic atom definitions
2. ✅ AtomState and Mounted type definitions
3. ✅ Dependency tracking in getter
4. ✅ Invalidation algorithm (BFS)
5. ✅ Topological sort (DFS)
6. ✅ Epoch number comparison
7. ✅ Performance comparison table

## Diagrams to Include

1. ✅ Dependency graph (countAtom → doubleAtom → quadAtom)
2. ✅ Invalidation wave (showing propagation)
3. ✅ Read flow diagram
4. ✅ Write flow diagram

## Links to Include

- Jotai GitHub repo
- Specific source files (atom.ts, internals.ts)
- Your mini-jotai implementation
- Related articles on reactive programming
- Topological sort explanation

## SEO Keywords

- Jotai dependency tracking
- React state management internals
- Reactive programming patterns
- Topological sort algorithm
- Jotai source code analysis
- State management performance

