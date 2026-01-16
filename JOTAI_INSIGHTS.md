# Key Insights from Real Jotai Source Code

## 1. Atom Implementation (`atom.ts`)

### How Primitive Atoms Work

```typescript
// Real Jotai code:
function defaultRead<Value>(this: Atom<Value>, get: Getter) {
  return get(this)  // Calls store.get(this) - NOT circular!
}

function defaultWrite<Value>(
  this: PrimitiveAtom<Value>,
  get: Getter,
  set: Setter,
  arg: SetStateAction<Value>,
) {
  return set(
    this,
    typeof arg === 'function'
      ? (arg as (prev: Value) => Value)(get(this))
      : arg,
  )
}
```

**Key Insight:** Primitive atoms DO have read/write functions! They call `get(this)` and `set(this, ...)`.

**How is this not circular?** The Store checks for the `init` property BEFORE calling `read()`:

```typescript
// In the Store's getter function:
function getter<V>(a: Atom<V>) {
  if (a === atom) {  // Reading self
    const aState = ensureAtomState(store, a)
    if (!isAtomStateInitialized(aState)) {
      if (hasInitialValue(a)) {  // Check for 'init' property!
        setAtomStateValueOrPromise(store, a, a.init)  // Use init, don't call read()
      }
    }
    return returnAtomValue(aState)
  }
  // Reading other atoms - call readAtomState which calls atom.read()
}
```

### Atom Detection

```typescript
function hasInitialValue<T extends Atom<AnyValue>>(atom: T): boolean {
  return 'init' in atom
}
```

Primitive atoms are detected by the presence of the `init` property.

### Updater Functions

```typescript
// defaultWrite handles both:
setCount(5)           // Direct value
setCount(c => c + 1)  // Updater function

// Implementation:
typeof arg === 'function'
  ? (arg as (prev: Value) => Value)(get(this))  // Call with current value
  : arg
```

## 2. Store Implementation (`internals.ts`)

### AtomState Structure

```typescript
type AtomState<Value = AnyValue> = {
  /** Map of atoms that the atom depends on (with epoch numbers) */
  readonly d: Map<AnyAtom, EpochNumber>
  /** Set of atoms with pending promises that depend on this atom */
  readonly p: Set<AnyAtom>
  /** The epoch number of the atom (increments on change) */
  n: EpochNumber
  /** Atom value */
  v?: Value
  /** Atom error */
  e?: AnyError
}
```

**Key fields:**
- `d` - Dependencies (atoms this one reads from)
- `n` - Epoch number (version counter, increments on each change)
- `v` - Current value
- `e` - Error (if read threw)

### Mounted State

```typescript
type Mounted = {
  /** Set of listeners (React components) */
  readonly l: Set<() => void>
  /** Set of mounted atoms this depends on */
  readonly d: Set<AnyAtom>
  /** Set of mounted atoms that depend on this (dependents) */
  readonly t: Set<AnyAtom>
  /** Unmount cleanup function */
  u?: () => void
}
```

Atoms are "mounted" when they have subscribers or are dependencies of mounted atoms.

### Dependency Tracking

The Store tracks dependencies during `read()`:

```typescript
function getter<V>(a: Atom<V>) {
  // ... read the atom ...
  const aState = readAtomState(store, a)
  
  // Record dependency: current atom depends on 'a'
  atomState.d.set(a, aState.n)  // Store with epoch number
  
  // Add reverse dependency: 'a' has current atom as dependent
  if (mountedMap.has(atom)) {
    mountedMap.get(a)?.t.add(atom)
  }
  
  return returnAtomValue(aState)
}
```

### Change Propagation

When an atom changes:

1. **Invalidate dependents** - Mark all atoms that depend on this one as stale
2. **Topological sort** - Build a sorted list of affected atoms
3. **Recompute** - Recompute each atom in dependency order
4. **Notify listeners** - Call React component re-render functions

```typescript
// Invalidate dependents (BFS)
const stack: AnyAtom[] = [atom]
while (stack.length) {
  const a = stack.pop()!
  for (const dependent of getMountedOrPendingDependents(a, aState, mountedMap)) {
    invalidatedAtoms.set(dependent, dependentState.n)
    stack.push(dependent)
  }
}
```

## 3. Key Patterns for Your Implementation

### Pattern 1: Epoch Numbers for Change Detection

Instead of comparing values, Jotai uses epoch numbers (version counters):

```typescript
// Check if dependency has changed:
for (const [dep, epochNumber] of atomState.d) {
  if (readAtomState(store, dep).n !== epochNumber) {
    hasChangedDeps = true  // Dependency changed!
  }
}
```

### Pattern 2: Lazy Initialization

Atoms are only initialized when first read:

```typescript
if (!isAtomStateInitialized(atomState)) {
  if (hasInitialValue(a)) {
    setAtomStateValueOrPromise(store, a, a.init)
  }
}
```

### Pattern 3: Separate Mounted vs Unmounted State

- `atomStateMap` - Tracks ALL atoms (mounted or not)
- `mountedMap` - Only tracks atoms with subscribers

This allows garbage collection of unused atoms.

## 4. Simplified Implementation Strategy

For your mini-jotai, you can simplify:

1. **Skip async/promises** - Only handle synchronous values
2. **Skip mounting** - Always recompute (less efficient but simpler)
3. **Skip epoch numbers** - Use value comparison (less efficient but simpler)
4. **Skip topological sort** - Use simpler invalidation (may have redundant recomputes)

But keep the core patterns:
- Atoms have `init` property for primitives
- `defaultRead` and `defaultWrite` functions
- Dependency tracking in `atomState.d`
- Dependents tracking for invalidation
- WeakMap for atom state storage

## 5. What You Should Implement

Based on real Jotai, update your implementation:

### `src/atom.ts`:
```typescript
export function atom<Value, Args extends unknown[], Result>(
  read?: Value | Read<Value, SetAtom<Args, Result>>,
  write?: Write<Args, Result>,
) {
  const config = {} as WritableAtom<Value, Args, Result> & { init?: Value }
  
  if (typeof read === 'function') {
    config.read = read
  } else {
    config.init = read
    config.read = defaultRead
    config.write = defaultWrite as unknown as Write<Args, Result>
  }
  
  if (write) {
    config.write = write
  }
  
  return config
}

function defaultRead<Value>(this: Atom<Value>, get: Getter) {
  return get(this)
}

function defaultWrite<Value>(
  this: PrimitiveAtom<Value>,
  get: Getter,
  set: Setter,
  arg: SetStateAction<Value>,
) {
  return set(
    this,
    typeof arg === 'function' ? arg(get(this)) : arg,
  )
}
```

### `src/types.ts`:
Add to `AtomState`:
```typescript
export interface AtomState<Value = unknown> {
  value?: Value;
  dependencies: Map<Atom<unknown>, number>;  // Atom -> version
  dependents: Set<Atom<unknown>>;
  version: number;  // Increment on each change
}
```

This matches the real Jotai structure!

