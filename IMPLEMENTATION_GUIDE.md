# Implementation Guide

This guide provides detailed hints and strategies for implementing each part of mini-jotai.

## Part 1: Atom Creation (`src/atom.ts`)

### Understanding the Three Overloads

```typescript
// Overload 1: Primitive atom
atom(0) // Creates an atom that holds a number

// Overload 2: Read-only derived atom  
atom((get) => get(countAtom) * 2) // Computes from other atoms

// Overload 3: Writable derived atom
atom(
  (get) => get(countAtom) * 2,
  (get, set, newValue) => set(countAtom, newValue / 2)
)
```

### Implementation Strategy

1. **Check the type of the first argument:**
   ```typescript
   if (typeof read === 'function') {
     // It's a derived atom (overload 2 or 3)
   } else {
     // It's a primitive atom (overload 1)
   }
   ```

2. **For primitive atoms**, you need to create the read and write functions:
   ```typescript
   // The read function should return the stored value
   // But where is it stored? In the Store! (implemented later)
   // For now, just create a function that will be called by the store
   
   const primitiveRead = (get) => {
     // The store will handle this
     // Just return something for now
   };
   
   const primitiveWrite = (get, set, newValue) => {
     // The store will handle updating the value
   };
   ```

3. **Return an object** that matches the Atom or WritableAtom interface

### Key Insight

The atom itself doesn't store any state! It's just a configuration object that tells the Store how to read and write values.

---

## Part 2: Store Implementation (`src/store.ts`)

This is the most complex part. Take it step by step.

### Step 2.1: Define AtomState

First, decide what information you need to track for each atom:

```typescript
export interface AtomState<Value = unknown> {
  value: Value;                    // Current value
  dependencies: Set<Atom<unknown>>; // Atoms this one depends on
  dependents: Set<Atom<unknown>>;   // Atoms that depend on this one
}
```

### Step 2.2: Implement `get(atom)`

The `get` method needs to:

1. Check if the atom already has state
2. If not, compute the initial value
3. Track dependencies
4. Return the value

```typescript
get<Value>(atom: Atom<Value>): Value {
  // 1. Check if we have state for this atom
  let atomState = this.atomStateMap.get(atom);
  
  if (!atomState) {
    // 2. First time reading this atom - compute initial value
    // Call atom.read() and pass our get method
    const value = atom.read(this.get.bind(this));
    
    // 3. Store the state
    atomState = {
      value,
      dependencies: new Set(),
      dependents: new Set(),
    };
    this.atomStateMap.set(atom, atomState);
  }
  
  // 4. Return the value
  return atomState.value as Value;
}
```

**Challenge:** How do you track dependencies? When atom A calls `get(atomB)`, you need to record that A depends on B.

**Hint:** Use a "currently computing" stack or variable to track which atom is being computed.

### Step 2.3: Implement `set(atom, ...args)`

The `set` method needs to:

1. Call the atom's write function
2. Update the stored value
3. Invalidate dependent atoms
4. Notify subscribers

```typescript
set<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
): Result {
  // 1. Call the write function
  const result = atom.write(
    this.get.bind(this),
    this.set.bind(this),
    ...args
  );
  
  // 2. The write function may have called set on other atoms
  // Those atoms need to notify their subscribers
  
  // 3. Find all atoms that depend on the changed atoms
  // and invalidate them (remove their cached values)
  
  // 4. Notify all subscribers
  
  return result;
}
```

**Challenge:** How do you know which atoms changed? You might need to track this during the write operation.

### Step 2.4: Implement `subscribe(atom, listener)`

This is simpler:

```typescript
subscribe<Value>(atom: Atom<Value>, listener: Listener): () => void {
  // Get or create the Set of listeners for this atom
  let listeners = this.listeners.get(atom);
  if (!listeners) {
    listeners = new Set();
    this.listeners.set(atom, listeners);
  }
  
  // Add the listener
  listeners.add(listener);
  
  // Return unsubscribe function
  return () => {
    listeners?.delete(listener);
  };
}
```

---

## Part 3: React Hooks (`src/hooks.ts`)

### Step 3.1: Implement `useAtom(atom)`

```typescript
export function useAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result> | Atom<Value>
) {
  const store = useStore();
  
  // Force re-render when atom changes
  const [, rerender] = useReducer((c) => c + 1, 0);
  
  // Subscribe to atom changes
  useEffect(() => {
    const unsubscribe = store.subscribe(atom, rerender);
    return unsubscribe; // Cleanup on unmount
  }, [store, atom]);
  
  // Get current value
  const value = store.get(atom);
  
  // Create setter function
  const setValue = useCallback(
    (...args: Args) => {
      if ('write' in atom) {
        return store.set(atom as WritableAtom<Value, Args, Result>, ...args);
      }
    },
    [store, atom]
  );
  
  return [value, setValue] as const;
}
```

### Step 3.2: Implement `useAtomValue(atom)`

Can you reuse `useAtom` here?

```typescript
export function useAtomValue<Value>(atom: Atom<Value>): Value {
  const [value] = useAtom(atom);
  return value;
}
```

### Step 3.3: Implement `useSetAtom(atom)`

This one doesn't subscribe:

```typescript
export function useSetAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>
): (...args: Args) => Result {
  const store = useStore();
  
  return useCallback(
    (...args: Args) => store.set(atom, ...args),
    [store, atom]
  );
}
```

---

## Part 4: Provider (`src/Provider.tsx`)

### Step 4.1: Implement `Provider`

```typescript
export function Provider({ children, store: storeProp }: ProviderProps) {
  // Create a store if one wasn't provided
  const storeRef = useRef<Store>();
  if (!storeRef.current) {
    storeRef.current = storeProp || createStore();
  }
  
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}
```

### Step 4.2: Implement `useStore()`

```typescript
export function useStore(): Store {
  const store = useContext(StoreContext);
  
  // If no provider, use default global store
  if (!store) {
    return getDefaultStore();
  }
  
  return store;
}
```

---

## Common Pitfalls

1. **Forgetting to bind `this`** when passing `get` and `set` to atom functions
2. **Not tracking dependencies** during atom.read() calls
3. **Infinite loops** when atoms depend on each other circularly
4. **Not cleaning up subscriptions** in useEffect
5. **Mutating state** instead of creating new objects

## Testing Strategy

1. Start with the CounterExample - it only uses primitive atoms
2. Move to DerivedAtomExample - tests dependency tracking
3. Finally TodoExample - tests complex interactions

## Debugging Tips

Add logging to see what's happening:

```typescript
get<Value>(atom: Atom<Value>): Value {
  console.log('Getting atom:', atom.debugLabel || atom);
  // ... rest of implementation
}
```

Good luck! Remember, the goal is to learn, so don't worry if it takes a few tries to get it right.

