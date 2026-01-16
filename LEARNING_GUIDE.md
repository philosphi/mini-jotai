# Mini-Jotai Learning Guide

## What You've Learned So Far

### 1. The Atom Function is Now Implemented! ✅

You've successfully implemented the `atom()` function based on the real Jotai source code. Let's review what you learned:

#### Key Insight: Primitive Atoms DO Have Read/Write Functions!

**Your Initial Assumption (Wrong):**
```typescript
// You thought primitive atoms would be like this:
const countAtom = {
  init: 0,
  // No read/write functions
}
```

**Reality (From Real Jotai):**
```typescript
// Primitive atoms actually have read/write functions:
const countAtom = {
  init: 0,
  read: function defaultRead(get) {
    return get(this);  // Calls store.get(this)
  },
  write: function defaultWrite(get, set, arg) {
    return set(this, typeof arg === 'function' ? arg(get(this)) : arg);
  }
}
```

#### Why This Isn't Circular

**The Question:** If `defaultRead` calls `get(this)`, and `get()` calls `atom.read()`, isn't this circular?

**The Answer:** The Store checks for the `init` property BEFORE calling `read()`:

```typescript
// In the Store's getter function:
function getter<V>(a: Atom<V>) {
  if (a === atom) {  // Reading self
    const aState = ensureAtomState(store, a);
    if (!isAtomStateInitialized(aState)) {
      if ('init' in a) {  // ← Check for 'init' property!
        // Use the init value directly, don't call read()
        setAtomStateValueOrPromise(store, a, a.init);
      }
    }
    return returnAtomValue(aState);
  }
  // Reading other atoms - call readAtomState which calls atom.read()
}
```

### 2. How Atom Detection Works

**Primitive Atoms:**
- Have `init` property
- Use `defaultRead` and `defaultWrite`
- Store detects them with `'init' in atom`

**Derived Atoms:**
- NO `init` property
- Have custom `read` function
- May have custom `write` function

### 3. Updater Functions

The `defaultWrite` function handles both direct values and updater functions:

```typescript
// Both of these work:
setCount(5);           // Direct value
setCount(c => c + 1);  // Updater function

// Implementation:
typeof arg === 'function'
  ? arg(get(this))  // Call with current value
  : arg             // Use value directly
```

## Next Steps: Implementing the Store

Now that you have the `atom()` function working, you need to implement the Store. Here's what you need to understand:

### Store Responsibilities

1. **State Storage** - Store atom values in a WeakMap
2. **Dependency Tracking** - Track which atoms depend on which
3. **Change Propagation** - When an atom changes, update dependents
4. **Subscription** - Allow React components to subscribe to changes

### Key Data Structures (From Real Jotai)

```typescript
// AtomState - stored for each atom
interface AtomState<Value> {
  d: Map<Atom<unknown>, number>;  // Dependencies (atom -> version)
  n: number;                       // Version number (epoch)
  v?: Value;                       // Current value
  e?: Error;                       // Error if read threw
}

// Mounted - only for atoms with subscribers
interface Mounted {
  l: Set<() => void>;              // Listeners (React components)
  d: Set<Atom<unknown>>;           // Mounted dependencies
  t: Set<Atom<unknown>>;           // Mounted dependents
  u?: () => void;                  // Unmount cleanup
}
```

### Questions to Guide Your Implementation

#### Question 1: How does the Store track dependencies?

When an atom's `read()` function calls `get(otherAtom)`, the Store needs to record:
- "This atom depends on otherAtom"
- "otherAtom has this atom as a dependent"

**Think about:**
- Where do you record this information?
- When do you record it?
- How do you use it later?

#### Question 2: How does change propagation work?

When you call `store.set(countAtom, 5)`:
1. Update countAtom's value
2. Find all atoms that depend on countAtom
3. Mark them as "stale" (need recomputation)
4. Recompute them in the correct order
5. Notify React components

**Think about:**
- How do you find dependents?
- What order do you recompute in? (Hint: topological sort)
- How do you avoid recomputing the same atom twice?

#### Question 3: How do you handle reading an atom for the first time?

```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);

// First time reading doubleAtom:
store.get(doubleAtom);
```

**Think about:**
- doubleAtom has no value yet
- Its read function needs to call `get(countAtom)`
- countAtom also has no value yet
- How do you initialize both?

### Simplified Implementation Strategy

For your learning implementation, you can simplify:

1. **Skip async/promises** - Only handle synchronous values
2. **Skip mounting optimization** - Always recompute (less efficient but simpler)
3. **Skip epoch numbers** - Use value comparison (less efficient but simpler)
4. **Skip topological sort** - Use simpler invalidation (may have redundant recomputes)

But keep the core patterns:
- WeakMap for atom state storage
- Dependency tracking during read
- Dependent invalidation during write
- Listener notification

### Implementation Hints

#### Hint 1: Start with `get()`

Implement `store.get(atom)` first. This is the foundation.

```typescript
get<Value>(atom: Atom<Value>): Value {
  // 1. Get or create atom state
  // 2. If not initialized:
  //    - If primitive (has 'init'), use init value
  //    - If derived, call atom.read(getter)
  // 3. Return the value
}
```

#### Hint 2: Track dependencies in the getter

```typescript
const getter = <V>(a: Atom<V>): V => {
  const value = this.get(a);
  
  // Record dependency: currentAtom depends on 'a'
  // (You'll need to track which atom is currently being read)
  
  return value;
};
```

#### Hint 3: Invalidate dependents in `set()`

```typescript
set<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
): Result {
  // 1. Call atom.write(getter, setter, ...args)
  // 2. Find all dependents
  // 3. Mark them as stale
  // 4. Recompute them
  // 5. Notify listeners
}
```

## Your Task

Now implement the Store! Use the insights from real Jotai, but simplify where possible.

**Success Criteria:**
- `store.get(primitiveAtom)` returns the value
- `store.set(primitiveAtom, newValue)` updates the value
- `store.get(derivedAtom)` computes the value
- Dependencies are tracked correctly
- Changes propagate to dependents
- `store.sub(atom, listener)` notifies on changes

Good luck! 🚀

