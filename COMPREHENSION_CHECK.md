# Comprehension Check: Understanding Jotai's Design

Before you implement the Store, make sure you can answer these questions. These are the key insights from studying the real Jotai source code.

## Part 1: Atom Basics

### Q1: What's the difference between a primitive atom and a derived atom?

**Primitive Atom:**
```typescript
const countAtom = atom(0);
```

**Derived Atom:**
```typescript
const doubleAtom = atom((get) => get(countAtom) * 2);
```

**Answer:**
- Primitive atoms have an `init` property
- Derived atoms do NOT have an `init` property
- The Store uses `'init' in atom` to detect primitive atoms

### Q2: Do primitive atoms have read/write functions?

**Answer:**
Yes! They use `defaultRead` and `defaultWrite`:

```typescript
function defaultRead<Value>(this: Atom<Value>, get: Getter) {
  return get(this);  // Calls store.get(this)
}

function defaultWrite<Value>(
  this: PrimitiveAtom<Value>,
  get: Getter,
  set: Setter,
  arg: Value | ((prev: Value) => Value)
) {
  return set(
    this,
    typeof arg === 'function' ? arg(get(this)) : arg
  );
}
```

### Q3: Why isn't `defaultRead` circular?

`defaultRead` calls `get(this)`, which calls `store.get(this)`, which would call `atom.read()` again... right?

**Answer:**
The Store checks for the `init` property BEFORE calling `read()`:

```typescript
// In store.get():
if ('init' in atom && !isInitialized(atomState)) {
  // Use atom.init directly, don't call atom.read()
  atomState.value = atom.init;
}
```

### Q4: How does `defaultWrite` handle updater functions?

```typescript
setCount(5);           // Direct value
setCount(c => c + 1);  // Updater function
```

**Answer:**
```typescript
typeof arg === 'function'
  ? arg(get(this))  // Call function with current value
  : arg             // Use value directly
```

## Part 2: Store Design

### Q5: What information does the Store need to track for each atom?

**Answer (from real Jotai):**
```typescript
interface AtomState<Value> {
  d: Map<Atom<unknown>, number>;  // Dependencies (atom -> version)
  n: number;                       // Version number (epoch)
  v?: Value;                       // Current value
  e?: Error;                       // Error if read threw
}
```

**Simplified version:**
```typescript
interface AtomState<Value> {
  value?: Value;
  dependencies: Set<Atom<unknown>>;
  dependents: Set<Atom<unknown>>;
  version: number;
}
```

### Q6: When does dependency tracking happen?

**Answer:**
During `atom.read()` execution. When the read function calls `get(otherAtom)`, the Store records:
1. "This atom depends on otherAtom" (add to dependencies)
2. "otherAtom has this atom as a dependent" (add to dependents)

### Q7: What happens when you call `store.set(countAtom, 5)`?

**Answer:**
1. Call `atom.write(getter, setter, 5)`
2. For primitive atoms, `defaultWrite` calls `setter(this, 5)`
3. Store updates the value in atomState
4. Store increments the version number
5. Store finds all dependents
6. Store marks dependents as stale
7. Store recomputes dependents (in dependency order)
8. Store notifies listeners (React components)

### Q8: How do you find all atoms that need to be recomputed?

**Answer:**
Use the `dependents` set! When `countAtom` changes:
1. Get `atomState.dependents` for countAtom
2. For each dependent, mark it as stale
3. Recursively mark THEIR dependents as stale (BFS or DFS)
4. Recompute all stale atoms in dependency order

### Q9: What order should you recompute atoms in?

Given:
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const quadAtom = atom((get) => get(doubleAtom) * 2);
```

When `countAtom` changes, what order should you recompute?

**Answer:**
Topological order (dependencies before dependents):
1. countAtom (changed)
2. doubleAtom (depends on countAtom)
3. quadAtom (depends on doubleAtom)

**Simplified approach:**
Just recompute in any order, but make sure to recompute dependencies first.
The `atom.read()` function will call `get()` which will recompute dependencies automatically.

### Q10: How do you avoid recomputing the same atom twice?

**Answer:**
Use version numbers (epoch numbers):
- Each atom has a version number
- When an atom changes, increment its version
- When checking if a dependency changed, compare version numbers
- If all dependencies have the same version, skip recomputation

**Simplified approach:**
Just recompute everything that's marked as stale. Less efficient but simpler.

## Part 3: Implementation Strategy

### Q11: What's the minimal Store API?

**Answer:**
```typescript
interface Store {
  get<Value>(atom: Atom<Value>): Value;
  set<Value, Args extends unknown[], Result>(
    atom: WritableAtom<Value, Args, Result>,
    ...args: Args
  ): Result;
  sub(atom: Atom<unknown>, listener: () => void): () => void;
}
```

### Q12: What's the simplest implementation approach?

**Answer:**
1. **Start with `get()`** - Implement reading atoms
2. **Add dependency tracking** - Track which atoms depend on which
3. **Implement `set()`** - Update values and propagate changes
4. **Add `sub()`** - Allow listeners to subscribe
5. **Test with examples** - Make sure it works!

### Q13: What can you simplify for learning?

**Answer:**
- Skip async/promises (only synchronous values)
- Skip mounting optimization (always recompute)
- Skip epoch numbers (use value comparison)
- Skip topological sort (use simpler invalidation)
- Skip error handling (assume reads don't throw)

### Q14: What should you NOT simplify?

**Answer:**
- Dependency tracking (core feature)
- Dependent invalidation (core feature)
- Listener notification (needed for React)
- WeakMap for storage (prevents memory leaks)
- Checking for `init` property (distinguishes primitive vs derived)

## Part 4: Testing Your Understanding

### Exercise 1: Trace the execution

Given:
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);

const store = createStore();
const value = store.get(doubleAtom);
```

**Trace the execution step by step:**
1. `store.get(doubleAtom)` is called
2. doubleAtom is not initialized
3. doubleAtom has no `init` property (derived atom)
4. Call `doubleAtom.read(getter)`
5. Inside read, `get(countAtom)` is called
6. This calls `store.get(countAtom)` recursively
7. countAtom is not initialized
8. countAtom HAS `init` property (primitive atom)
9. Use `countAtom.init` (0) as the value
10. Store value in atomState for countAtom
11. Return 0 to doubleAtom's read function
12. Track dependency: doubleAtom depends on countAtom
13. doubleAtom.read returns 0 * 2 = 0
14. Store value in atomState for doubleAtom
15. Return 0 to caller

### Exercise 2: Trace the update

Given the same atoms, now:
```typescript
store.set(countAtom, 5);
```

**Trace the execution:**
1. `store.set(countAtom, 5)` is called
2. countAtom has `init` property (primitive atom)
3. Call `defaultWrite(getter, setter, 5)`
4. defaultWrite calls `setter(this, 5)`
5. Store updates atomState.value = 5
6. Store increments atomState.version
7. Store finds dependents: [doubleAtom]
8. Mark doubleAtom as stale
9. Recompute doubleAtom by calling `doubleAtom.read(getter)`
10. doubleAtom.read calls `get(countAtom)`
11. Returns 5 * 2 = 10
12. Store updates doubleAtom's value to 10
13. Notify listeners for countAtom
14. Notify listeners for doubleAtom

## Ready to Implement?

If you can answer all these questions, you're ready to implement the Store!

Start with `store.get()` and work your way up. Good luck! 🚀

