# mini-jotai

A minimal implementation of [Jotai](https://jotai.org/) built from scratch as a learning exercise.

## 🎯 Purpose

This project is designed to help you understand how Jotai (and similar atomic state management libraries) work under the hood by implementing the core concepts yourself. The project provides a complete skeleton with type definitions, function signatures, and detailed comments, but leaves the actual implementation logic for you to code.

## 🏗️ Project Structure

```
mini-jotai/
├── src/
│   ├── types.ts          # Core type definitions
│   ├── atom.ts           # Atom creation functions
│   ├── store.ts          # Store implementation (state management)
│   ├── Provider.tsx      # React context provider
│   ├── hooks.ts          # React hooks (useAtom, etc.)
│   └── index.ts          # Public API exports
├── example/
│   └── src/
│       ├── App.tsx       # Example app
│       └── examples/     # Example components demonstrating usage
└── package.json
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Install library dependencies
npm install

# Install example app dependencies
cd example
npm install
cd ..
```

### 2. Implementation Order

Follow this order to implement the functionality:

#### Step 1: Implement `atom()` function (src/atom.ts)

The `atom()` function creates atom definitions. You need to handle three cases:

- `atom(value)` - primitive atom with initial value
- `atom(readFn)` - read-only derived atom
- `atom(readFn, writeFn)` - writable derived atom

**Key concepts:**

- Atoms are just configuration objects, not state containers
- Each atom should be a unique object (used as WeakMap key)
- For primitive atoms, you need to create read/write functions

#### Step 2: Implement `Store` class (src/store.ts)

The Store is the heart of the system. It manages:

- Atom state storage (use `WeakMap<Atom, AtomState>`)
- Dependency tracking between atoms
- Subscription management
- Change notifications

**Key methods to implement:**

- `get(atom)` - Read atom value, track dependencies
- `set(atom, ...args)` - Update atom, notify subscribers
- `subscribe(atom, listener)` - Subscribe to changes

**Key challenges:**

- Computing derived atom values by calling their read functions
- Tracking which atoms depend on which other atoms
- Invalidating and recomputing dependent atoms when values change
- Notifying React components when atoms they use change

#### Step 3: Implement React Hooks (src/hooks.ts)

Connect the store to React's rendering system:

**`useAtom(atom)`**

- Read current value from store
- Subscribe to changes and re-render when atom updates
- Return setter function for writable atoms

**`useAtomValue(atom)`**

- Like useAtom but only returns the value
- Still subscribes to updates

**`useSetAtom(atom)`**

- Returns only the setter function
- Doesn't subscribe (no re-renders)

**Key concepts:**

- Use `useReducer` or `useState` to trigger re-renders
- Use `useEffect` for subscriptions
- Clean up subscriptions on unmount

#### Step 4: Implement `Provider` component (src/Provider.tsx)

Create a React context to provide the store:

- Use `useRef` to create a stable store instance
- Support custom stores or create a default one
- Implement `useStore()` hook to access the store

### 3. Test Your Implementation

```bash
# Build the library
npm run build

# Run the example app
npm run example
```

The example app includes three progressively complex examples:

1. **CounterExample** - Basic primitive atoms
2. **DerivedAtomExample** - Read-only and writable derived atoms
3. **TodoExample** - Complex state with multiple atoms

Uncomment each example in `example/src/App.tsx` as you implement the functionality.

## 📚 Key Concepts to Understand

### Atoms vs State

- **Atoms are definitions**, not values
- The actual state lives in the Store
- Multiple stores can have different values for the same atom

### Dependency Tracking

- When atom A reads atom B (via `get(B)`), A depends on B
- When B changes, A needs to be recomputed
- You need to track these dependencies in the Store

### Subscription Model

- React components subscribe to atoms they use
- When an atom changes, notify all subscribers
- Subscribers re-render their components

### Derived Atoms

- Compute their value from other atoms
- Don't store values themselves
- Automatically update when dependencies change

## 🧪 Testing Your Understanding

As you implement, ask yourself:

1. **Atom creation**: How do you distinguish between `atom(value)` and `atom(readFn)`?
2. **State storage**: What data structure should `AtomState` contain?
3. **Dependency tracking**: How do you know which atoms depend on which?
4. **Change propagation**: When atom A changes, how do you update atoms that depend on A?
5. **React integration**: How do you trigger re-renders when atoms change?

## 🎓 Learning Resources

- [Jotai Documentation](https://jotai.org/)
- [Jotai Source Code](https://github.com/pmndrs/jotai)
- [Understanding Atomic State Management](https://blog.axlight.com/posts/what-is-state-usage-tracking/)

## 📝 Implementation Tips

### For `atom()`

```typescript
// Check if first arg is a function
if (typeof read === "function") {
  // It's a derived atom
} else {
  // It's a primitive atom - create read/write functions
}
```

### For `Store.get()`

```typescript
// 1. Check if atom has state
// 2. If not, compute initial value by calling atom.read()
// 3. Track dependencies during computation
// 4. Cache the result
// 5. Return the value
```

### For `Store.set()`

```typescript
// 1. Call atom.write()
// 2. Track which atoms were modified
// 3. Invalidate dependent atoms
// 4. Notify subscribers
```

### For `useAtom()`

```typescript
// 1. Get store from context
// 2. Read current value
// 3. Subscribe to changes in useEffect
// 4. Create setter with useCallback
// 5. Return [value, setter]
```

## 🐛 Debugging Tips

- Add `console.log` statements to track atom reads/writes
- Use the `debugLabel` property on atoms
- Implement the optional `getDebugState()` method in Store
- Check that subscriptions are properly cleaned up

## ✅ Success Criteria

You've successfully implemented mini-jotai when:

1. ✅ All three examples run without errors
2. ✅ Counters update correctly
3. ✅ Derived atoms recompute when dependencies change
4. ✅ Components only re-render when atoms they use change
5. ✅ Todo list works with filtering and stats

## 🚧 Optional Extensions

Once you have the basics working, try:

- Implement `atom.reset()` functionality
- Add async atom support
- Implement atom families (parameterized atoms)
- Add dev tools / debugging utilities
- Implement `atomWithStorage` (persist to localStorage)
- Add batched updates to avoid intermediate renders

## 📄 License

MIT

---

**Happy Learning! 🎉**

Remember: The goal isn't to build a production-ready library, but to deeply understand how atomic state management works. Take your time, experiment, and don't hesitate to look at the real Jotai source code if you get stuck!
