# Mini-Jotai Scope Definition
## What to Build vs What to Skip

This document keeps you focused on the teaching implementation scope.

---

## ✅ IN SCOPE - Must Build (14-16 hours)

### Core Atom System

**1. Atom Creation** ✅ DONE
```typescript
const countAtom = atom(0);                           // Primitive
const doubleAtom = atom((get) => get(countAtom) * 2); // Derived
```
- [x] `atom()` function with overloads
- [x] `defaultRead` and `defaultWrite`
- [x] Type definitions

**Why:** Foundation of everything, already complete

---

**2. Store.get() - Reading Atoms**
```typescript
store.get(countAtom);   // Returns 0
store.get(doubleAtom);  // Returns 0
```
- [ ] Detect primitive vs derived (check for `init`)
- [ ] Initialize primitive atoms with `init` value
- [ ] Call `atom.read(getter)` for derived atoms
- [ ] Cache computed values

**Why:** Core functionality, demonstrates how atoms work

---

**3. Dependency Tracking**
```typescript
// When doubleAtom.read() calls get(countAtom):
// → Record: doubleAtom depends on countAtom
// → Record: countAtom has doubleAtom as dependent
```
- [ ] Track current atom being read (context)
- [ ] Record dependencies during `get()`
- [ ] Record reverse dependencies (dependents)
- [ ] Store in AtomState

**Why:** THE core algorithm for your blog

---

**4. Store.set() - Writing Atoms**
```typescript
store.set(countAtom, 5);
```
- [ ] Call `atom.write(getter, setter, ...args)`
- [ ] For primitive atoms, update value directly
- [ ] For derived atoms, call custom write function

**Why:** Core functionality, completes the basic API

---

**5. Change Propagation - Invalidation (BFS)**
```typescript
// When countAtom changes:
// → Find all dependents (BFS)
// → Mark them as stale
```
- [ ] Implement BFS to find all dependents
- [ ] Mark atoms as needing recomputation
- [ ] Handle transitive dependencies

**Why:** Key algorithm for your blog, demonstrates graph traversal

---

**6. Change Propagation - Topological Sort (DFS)**
```typescript
// Recompute in correct order:
// countAtom → doubleAtom → quadAtom
```
- [ ] Implement DFS-based topological sort
- [ ] Build reverse topological order
- [ ] Recompute in dependency order

**Why:** THE most interesting algorithm for your blog

---

**7. Subscription System**
```typescript
const unsub = store.sub(countAtom, () => console.log('changed'));
store.set(countAtom, 5);  // Calls listener
```
- [ ] Add listeners to AtomState
- [ ] Implement `store.sub()`
- [ ] Notify listeners after changes
- [ ] Return unsubscribe function

**Why:** Needed for React integration, completes the API

---

**8. Basic Tests**
```typescript
test('primitive atom', () => {
  const atom = atom(0);
  expect(store.get(atom)).toBe(0);
});
```
- [ ] Test each milestone
- [ ] Test all blog examples
- [ ] Ensure correctness

**Why:** Confidence in your implementation, examples for blog

---

## ❌ OUT OF SCOPE - Skip These

### Async & Promises

**Skip:**
```typescript
const asyncAtom = atom(async (get) => {
  const response = await fetch('/api/data');
  return response.json();
});
```

**Why skip:**
- Adds 10+ hours of complexity
- Not core to dependency tracking
- Not needed for blog topic
- Can mention in "future work"

**Blog impact:** None - you can explain "this also works with async"

---

### Suspense Integration

**Skip:**
```typescript
function Component() {
  const [data] = useAtom(asyncAtom);  // Suspends
  return <div>{data}</div>;
}
```

**Why skip:**
- Requires async atoms first
- React-specific complexity
- Not about dependency tracking
- Not needed for blog

**Blog impact:** None - focus is on dependency tracking, not React integration

---

### Mounting Optimization

**Skip:**
```typescript
// Real Jotai only recomputes mounted atoms
// You can recompute all stale atoms (simpler)
```

**Why skip:**
- Complex tracking of mounted state
- Performance optimization, not core algorithm
- Adds 5+ hours
- Doesn't change the algorithm

**Blog impact:** Minimal - mention "real Jotai optimizes this"

---

### Epoch Numbers

**Skip (or simplify):**
```typescript
// Real Jotai:
atomState.n++;  // Increment epoch number
if (oldEpoch !== newEpoch) { /* changed */ }

// You can use:
atomState.stale = true;  // Simple boolean flag
```

**Why skip:**
- Can use simpler "stale" flag
- Epoch numbers are an optimization
- Core algorithm works without them

**Blog impact:** Small - you can explain epoch numbers conceptually

---

### WeakMap for GC

**Skip (or simplify):**
```typescript
// Real Jotai:
const atomStateMap = new WeakMap<Atom, AtomState>();

// You can use:
const atomStateMap = new Map<Atom, AtomState>();
```

**Why skip:**
- WeakMap behavior is same as Map for your use case
- GC is nice-to-have, not core algorithm
- Can upgrade later if needed

**Blog impact:** None - mention "real Jotai uses WeakMap for GC"

---

### Error Handling

**Skip:**
```typescript
// Real Jotai:
try {
  const value = atom.read(getter);
  atomState.v = value;
} catch (error) {
  atomState.e = error;  // Store error
}

// You can:
const value = atom.read(getter);
atomState.value = value;  // Assume success
```

**Why skip:**
- Adds complexity
- Not core to dependency tracking
- Can assume happy path

**Blog impact:** None - focus is on dependency tracking

---

### Updater Functions

**Optional (nice to have):**
```typescript
store.set(countAtom, (prev) => prev + 1);
```

**Why optional:**
- `defaultWrite` already handles this
- Just need to test it works
- 30 minutes to verify

**Blog impact:** Small - nice example of `defaultWrite`

**Recommendation:** Include if time permits, skip if rushed

---

### Write-Only Atoms

**Skip:**
```typescript
const writeOnlyAtom = atom(null, (get, set, value) => {
  set(otherAtom, value);
});
```

**Why skip:**
- Edge case
- Not common pattern
- Not needed for blog

**Blog impact:** None

---

### Atom Families

**Skip:**
```typescript
const todoAtomFamily = atomFamily((id) => atom({ id, text: '' }));
```

**Why skip:**
- Advanced feature
- Not about dependency tracking
- Separate topic

**Blog impact:** None - different topic

---

### DevTools Integration

**Skip:**
```typescript
// DevTools hooks, time-travel debugging, etc.
```

**Why skip:**
- Not core algorithm
- Separate topic
- Adds significant complexity

**Blog impact:** None

---

### onMount Callbacks

**Skip:**
```typescript
const atom = atom(0);
atom.onMount = (setAtom) => {
  const interval = setInterval(() => setAtom((c) => c + 1), 1000);
  return () => clearInterval(interval);
};
```

**Why skip:**
- Advanced feature
- Not core to dependency tracking
- Adds complexity

**Blog impact:** None

---

## 🎯 Focus Checklist

When implementing, ask yourself:

### Is this in scope?

- [ ] Does it help explain dependency tracking?
- [ ] Does it help explain topological sort?
- [ ] Is it needed for blog examples?
- [ ] Is it core to the algorithm?

**If NO to all → Skip it**

### Is this taking too long?

- [ ] Have I spent more than 2 hours on this feature?
- [ ] Is this blocking progress on core features?
- [ ] Can I simplify this?

**If YES to any → Simplify or skip**

### Am I gold-plating?

- [ ] Am I adding features not in the roadmap?
- [ ] Am I optimizing prematurely?
- [ ] Am I trying to match real Jotai exactly?

**If YES to any → Stop and refocus**

---

## 📊 Complexity Budget

**Total time budget: 14-16 hours**

| Feature | Time Budget | Priority |
|---------|-------------|----------|
| Store setup | 30 min | Must have |
| Read primitive atoms | 1 hour | Must have |
| Read derived atoms | 1.5 hours | Must have |
| Track dependencies | 1 hour | Must have |
| Basic set | 1 hour | Must have |
| Invalidate dependents (BFS) | 2 hours | Must have |
| Topological sort (DFS) | 2 hours | Must have |
| Recompute stale | 1 hour | Must have |
| Subscriptions | 2 hours | Must have |
| Tests | 1-2 hours | Must have |
| Documentation | 1 hour | Must have |
| Code quality | 1 hour | Must have |
| **Total** | **14-16 hours** | |

**No budget for:**
- Async/Promises (10+ hours)
- Suspense (5+ hours)
- Mounting optimization (5+ hours)
- DevTools (10+ hours)
- Error handling (2+ hours)
- Advanced features (5+ hours)

---

## ✅ Definition of Done

Your implementation is complete when:

**Functional:**
- [ ] All 8 in-scope features work
- [ ] All blog examples run correctly
- [ ] No major bugs in basic usage

**Educational:**
- [ ] Code is readable and commented
- [ ] Key algorithms are clear
- [ ] You can explain every part

**Credible:**
- [ ] Core behavior matches real Jotai
- [ ] Tests pass
- [ ] You're confident explaining it

**NOT required:**
- ❌ Handles all edge cases
- ❌ Production-ready
- ❌ Matches real Jotai exactly
- ❌ Has every feature

---

## 🚫 Scope Creep Warning Signs

**Watch out for:**

1. **"While I'm here..."**
   - Adding features not in roadmap
   - Optimizing prematurely
   - Gold-plating

2. **"Real Jotai does it this way..."**
   - Trying to match exactly
   - Adding complexity for accuracy
   - Forgetting the goal (learning, not production)

3. **"This would be cool..."**
   - Adding nice-to-have features
   - Exploring tangents
   - Losing focus

**When you notice these, ask:**
- Does this help my blog?
- Is this in the roadmap?
- Is this worth the time?

---

## Remember

**Your goal:** Understand dependency tracking deeply enough to write an excellent blog post

**Not your goal:** Build a production-ready Jotai clone

**The teaching implementation is enough!**

Stay focused, follow the roadmap, and you'll have a great implementation in 14-16 hours. 🚀

