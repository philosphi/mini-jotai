# Mini-Jotai Implementation Roadmap
## Simplified Core Approach (14-16 hours)

This roadmap focuses on building a "teaching implementation" that covers all concepts for your blog while remaining achievable.

---

## Phase 1: Reading Atoms (4 hours)

### Milestone 1.1: Store Setup (30 min)

**Goal:** Create the store structure

**Tasks:**
- [ ] Define `AtomState` interface (simplified)
- [ ] Create `createStore()` function
- [ ] Initialize WeakMap for atom states
- [ ] Set up basic store structure

**Test:**
```typescript
const store = createStore();
expect(store).toBeDefined();
expect(store.get).toBeDefined();
```

**Simplified AtomState:**
```typescript
interface AtomState<Value = unknown> {
  value?: Value;
  dependencies: Set<Atom<unknown>>;
  dependents: Set<Atom<unknown>>;
  initialized: boolean;
}
```

---

### Milestone 1.2: Read Primitive Atoms (1 hour)

**Goal:** `store.get(primitiveAtom)` returns the initial value

**Tasks:**
- [ ] Implement `ensureAtomState()` helper
- [ ] Implement `store.get()` for primitive atoms
- [ ] Check for `init` property
- [ ] Initialize with `atom.init` value
- [ ] Return stored value

**Test:**
```typescript
const countAtom = atom(0);
const store = createStore();
expect(store.get(countAtom)).toBe(0);
```

**Key Code:**
```typescript
function get<Value>(atom: Atom<Value>): Value {
  const atomState = ensureAtomState(atom);
  
  if (!atomState.initialized) {
    if ('init' in atom) {
      // Primitive atom
      atomState.value = atom.init;
      atomState.initialized = true;
    }
  }
  
  return atomState.value as Value;
}
```

---

### Milestone 1.3: Read Derived Atoms (1.5 hours)

**Goal:** `store.get(derivedAtom)` computes the value

**Tasks:**
- [ ] Create `getter` function for atom.read()
- [ ] Call `atom.read(getter)` for derived atoms
- [ ] Store computed value
- [ ] Return value

**Test:**
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const store = createStore();
expect(store.get(doubleAtom)).toBe(0);
```

**Key Code:**
```typescript
const getter = <V>(a: Atom<V>): V => {
  return this.get(a);  // Recursive call
};

if (!atomState.initialized) {
  if ('init' in atom) {
    // Primitive atom (already handled)
  } else {
    // Derived atom
    const value = atom.read(getter);
    atomState.value = value;
    atomState.initialized = true;
  }
}
```

---

### Milestone 1.4: Track Dependencies (1 hour)

**Goal:** Record which atoms depend on which

**Tasks:**
- [ ] Track current atom being read (context)
- [ ] In `getter`, record dependency
- [ ] Record reverse dependency (dependent)
- [ ] Test dependency tracking

**Test:**
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const store = createStore();
store.get(doubleAtom);

// Internal check: doubleAtom depends on countAtom
const doubleState = getAtomState(doubleAtom);
expect(doubleState.dependencies.has(countAtom)).toBe(true);

const countState = getAtomState(countAtom);
expect(countState.dependents.has(doubleAtom)).toBe(true);
```

**Key Code:**
```typescript
let currentAtom: Atom<unknown> | null = null;

const getter = <V>(a: Atom<V>): V => {
  const value = this.get(a);
  
  // Track dependency
  if (currentAtom) {
    const currentState = ensureAtomState(currentAtom);
    const aState = ensureAtomState(a);
    
    currentState.dependencies.add(a);
    aState.dependents.add(currentAtom);
  }
  
  return value;
};

// When reading an atom:
const prevAtom = currentAtom;
currentAtom = atom;
try {
  const value = atom.read(getter);
  // ...
} finally {
  currentAtom = prevAtom;
}
```

---

## Phase 2: Writing Atoms (6 hours)

### Milestone 2.1: Basic Set (1 hour)

**Goal:** `store.set(primitiveAtom, value)` updates the value

**Tasks:**
- [ ] Implement `store.set()` for primitive atoms
- [ ] Call `atom.write(getter, setter, ...args)`
- [ ] Update atom state value
- [ ] Test basic update

**Test:**
```typescript
const countAtom = atom(0);
const store = createStore();
store.set(countAtom, 5);
expect(store.get(countAtom)).toBe(5);
```

**Key Code:**
```typescript
function set<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
): Result {
  const getter = <V>(a: Atom<V>): V => this.get(a);
  
  const setter = <V, A extends unknown[], R>(
    a: WritableAtom<V, A, R>,
    ...args: A
  ): R => {
    if ('init' in a) {
      // Primitive atom - update directly
      const aState = ensureAtomState(a);
      aState.value = args[0] as V;
      return undefined as R;
    }
    // Derived writable atom - recursive call
    return this.set(a, ...args);
  };
  
  return atom.write(getter, setter, ...args);
}
```

---

### Milestone 2.2: Invalidate Dependents (2 hours)

**Goal:** Find all atoms that need recomputation

**Tasks:**
- [ ] Implement BFS to find all dependents
- [ ] Mark atoms as "stale"
- [ ] Test with complex dependency graph

**Test:**
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const quadAtom = atom((get) => get(doubleAtom) * 2);

const store = createStore();
store.get(quadAtom);  // Initialize all

store.set(countAtom, 5);
// Should invalidate: doubleAtom, quadAtom
```

**Key Code:**
```typescript
function invalidateDependents(atom: Atom<unknown>): Set<Atom<unknown>> {
  const stale = new Set<Atom<unknown>>();
  const queue: Atom<unknown>[] = [atom];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentState = ensureAtomState(current);
    
    for (const dependent of currentState.dependents) {
      if (!stale.has(dependent)) {
        stale.add(dependent);
        queue.push(dependent);
      }
    }
  }
  
  return stale;
}
```

---

### Milestone 2.3: Topological Sort (2 hours)

**Goal:** Recompute atoms in correct order

**Tasks:**
- [ ] Implement DFS-based topological sort
- [ ] Build reverse topological order
- [ ] Reverse to get correct order
- [ ] Test with complex dependencies

**Test:**
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const quadAtom = atom((get) => get(doubleAtom) * 2);

const store = createStore();
store.get(quadAtom);

store.set(countAtom, 5);
expect(store.get(doubleAtom)).toBe(10);  // Recomputed
expect(store.get(quadAtom)).toBe(20);    // Recomputed in correct order
```

**Key Code:**
```typescript
function topologicalSort(atoms: Set<Atom<unknown>>): Atom<unknown>[] {
  const result: Atom<unknown>[] = [];
  const visiting = new Set<Atom<unknown>>();
  const visited = new Set<Atom<unknown>>();
  
  function visit(atom: Atom<unknown>) {
    if (visited.has(atom)) return;
    if (visiting.has(atom)) {
      throw new Error('Circular dependency detected');
    }
    
    visiting.add(atom);
    
    const atomState = ensureAtomState(atom);
    for (const dep of atomState.dependencies) {
      visit(dep);
    }
    
    visiting.delete(atom);
    visited.add(atom);
    result.push(atom);  // Post-order
  }
  
  for (const atom of atoms) {
    visit(atom);
  }
  
  return result;  // Already in correct order (dependencies first)
}
```

---

### Milestone 2.4: Recompute Stale Atoms (1 hour)

**Goal:** Recompute all stale atoms in order

**Tasks:**
- [ ] Combine invalidation + topological sort
- [ ] Mark atoms as stale
- [ ] Recompute in order
- [ ] Test end-to-end

**Test:**
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const quadAtom = atom((get) => get(doubleAtom) * 2);
const sumAtom = atom((get) => get(countAtom) + get(doubleAtom));

const store = createStore();
store.get(quadAtom);
store.get(sumAtom);

store.set(countAtom, 5);

expect(store.get(countAtom)).toBe(5);
expect(store.get(doubleAtom)).toBe(10);
expect(store.get(quadAtom)).toBe(20);
expect(store.get(sumAtom)).toBe(15);
```

---

## Phase 3: Subscriptions (2 hours)

### Milestone 3.1: Basic Subscription (1.5 hours)

**Goal:** `store.sub(atom, listener)` notifies on changes

**Tasks:**
- [ ] Add listeners set to AtomState
- [ ] Implement `store.sub()`
- [ ] Notify listeners after set
- [ ] Return unsubscribe function

**Test:**
```typescript
const countAtom = atom(0);
const store = createStore();

let callCount = 0;
const unsub = store.sub(countAtom, () => callCount++);

store.set(countAtom, 1);
expect(callCount).toBe(1);

store.set(countAtom, 2);
expect(callCount).toBe(2);

unsub();
store.set(countAtom, 3);
expect(callCount).toBe(2);  // Not called after unsub
```

---

### Milestone 3.2: Notify Dependents (30 min)

**Goal:** Notify listeners of dependent atoms too

**Test:**
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const store = createStore();

let doubleCallCount = 0;
store.sub(doubleAtom, () => doubleCallCount++);

store.set(countAtom, 5);
expect(doubleCallCount).toBe(1);  // doubleAtom listener called
```

---

## Phase 4: Polish (2-4 hours)

### Milestone 4.1: Tests (1-2 hours)

**Tasks:**
- [ ] Write comprehensive test suite
- [ ] Test all blog examples
- [ ] Test edge cases
- [ ] Ensure 100% of blog code works

### Milestone 4.2: Documentation (1 hour)

**Tasks:**
- [ ] Add JSDoc comments
- [ ] Explain key algorithms
- [ ] Add README with examples
- [ ] Link to blog post

### Milestone 4.3: Code Quality (1 hour)

**Tasks:**
- [ ] Clean up code
- [ ] Remove debug logs
- [ ] Consistent formatting
- [ ] Add type safety

---

## Success Checklist

### Functional Requirements
- [ ] Can create primitive atoms
- [ ] Can create derived atoms
- [ ] Can read atom values
- [ ] Can update primitive atoms
- [ ] Dependencies tracked automatically
- [ ] Derived atoms recompute on dependency change
- [ ] Recomputation in correct order (topological)
- [ ] Can subscribe to changes
- [ ] Listeners notified correctly

### Quality Requirements
- [ ] All tests pass
- [ ] Code is readable
- [ ] Key algorithms commented
- [ ] No major bugs
- [ ] Works for all blog examples

### Blog Requirements
- [ ] Demonstrates dependency tracking
- [ ] Demonstrates topological sort
- [ ] Can create CodeSandbox demos
- [ ] Gives you confidence to explain concepts

---

## Time Tracking

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Phase 1: Reading | 4h | | |
| Phase 2: Writing | 6h | | |
| Phase 3: Subscriptions | 2h | | |
| Phase 4: Polish | 2-4h | | |
| **Total** | **14-16h** | | |

---

## Next Action

**Start here:** Milestone 1.1 - Store Setup (30 min)

Open `src/store.ts` and begin implementing!

