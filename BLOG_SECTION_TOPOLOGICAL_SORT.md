# Deep Dive: Topological Sort in Jotai

This is the most technically interesting part of your blog. Here's how to explain it clearly.

---

## The Problem: Recomputation Order Matters

When `countAtom` changes, we need to recompute its dependents. But in what order?

```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const quadAtom = atom((get) => get(doubleAtom) * 2);
const sumAtom = atom((get) => get(countAtom) + get(doubleAtom));
```

**Dependency graph:**
```
countAtom (changed to 5)
  ├─→ doubleAtom (needs recompute)
  │     ├─→ quadAtom (needs recompute)
  │     └─→ sumAtom (needs recompute)
  └─→ sumAtom (needs recompute)
```

**Wrong order:**
```typescript
// If we recompute quadAtom first:
quadAtom.read(get)
  → get(doubleAtom)  // Still has OLD value (0)!
  → 0 * 2 = 0        // Wrong! Should be 20

// Then recompute doubleAtom:
doubleAtom.read(get)
  → get(countAtom)   // New value (5)
  → 5 * 2 = 10       // Correct

// Now quadAtom is stale again!
```

**Correct order (topological):**
```typescript
1. countAtom (changed)
2. doubleAtom (depends on countAtom)
3. quadAtom (depends on doubleAtom)
4. sumAtom (depends on countAtom and doubleAtom)
```

**Rule:** Compute dependencies before dependents.

---

## Jotai's Solution: DFS-based Topological Sort

### Step 1: Build the list of affected atoms

```typescript
// Start with all changed atoms
const stack: AnyAtom[] = Array.from(changedAtoms);
const topSortedReversed: [atom, atomState][] = [];
const visiting = new WeakSet<AnyAtom>();
const visited = new WeakSet<AnyAtom>();
```

### Step 2: Depth-first traversal

```typescript
while (stack.length) {
  const a = stack[stack.length - 1]!;  // Peek, don't pop yet
  const aState = ensureAtomState(store, a);
  
  if (visited.has(a)) {
    // Already processed, skip
    stack.pop();
    continue;
  }
  
  if (visiting.has(a)) {
    // All dependents have been visited
    // Now we can add this atom to the sorted list
    if (invalidatedAtoms.get(a) === aState.n) {
      topSortedReversed.push([a, aState]);
    }
    visited.add(a);
    stack.pop();
    continue;
  }
  
  // First time visiting this atom
  visiting.add(a);
  
  // Push all dependents onto the stack
  for (const dependent of getMountedOrPendingDependents(a, aState, mountedMap)) {
    if (!visiting.has(dependent)) {
      stack.push(dependent);
    }
  }
}
```

### Step 3: Process in reverse order

```typescript
// The list is in reverse topological order
// So we iterate backwards
for (let i = topSortedReversed.length - 1; i >= 0; --i) {
  const [a, aState] = topSortedReversed[i]!;
  
  // Only recompute if dependencies actually changed
  let hasChangedDeps = false;
  for (const dep of aState.d.keys()) {
    if (dep !== a && changedAtoms.has(dep)) {
      hasChangedDeps = true;
      break;
    }
  }
  
  if (hasChangedDeps) {
    readAtomState(store, a);
    mountDependencies(store, a);
  }
  
  invalidatedAtoms.delete(a);
}
```

---

## Visual Walkthrough

Let's trace the algorithm with our example:

**Initial state:**
```
changedAtoms = [countAtom]
stack = [countAtom]
visiting = {}
visited = {}
topSortedReversed = []
```

**Iteration 1:**
```
a = countAtom (peek)
visiting.add(countAtom)
dependents = [doubleAtom, sumAtom]
stack = [countAtom, doubleAtom, sumAtom]
```

**Iteration 2:**
```
a = sumAtom (peek)
visiting.add(sumAtom)
dependents = []  // sumAtom has no dependents
stack = [countAtom, doubleAtom, sumAtom]
```

**Iteration 3:**
```
a = sumAtom (peek again)
visiting.has(sumAtom) = true
→ Add to topSortedReversed
→ Mark as visited
stack = [countAtom, doubleAtom]
topSortedReversed = [sumAtom]
```

**Iteration 4:**
```
a = doubleAtom (peek)
visiting.add(doubleAtom)
dependents = [quadAtom, sumAtom]
sumAtom already visiting, skip
stack = [countAtom, doubleAtom, quadAtom]
```

**Iteration 5:**
```
a = quadAtom (peek)
visiting.add(quadAtom)
dependents = []
stack = [countAtom, doubleAtom, quadAtom]
```

**Iteration 6:**
```
a = quadAtom (peek again)
visiting.has(quadAtom) = true
→ Add to topSortedReversed
→ Mark as visited
stack = [countAtom, doubleAtom]
topSortedReversed = [sumAtom, quadAtom]
```

**Iteration 7:**
```
a = doubleAtom (peek again)
visiting.has(doubleAtom) = true
→ Add to topSortedReversed
→ Mark as visited
stack = [countAtom]
topSortedReversed = [sumAtom, quadAtom, doubleAtom]
```

**Iteration 8:**
```
a = countAtom (peek again)
visiting.has(countAtom) = true
→ Add to topSortedReversed
→ Mark as visited
stack = []
topSortedReversed = [sumAtom, quadAtom, doubleAtom, countAtom]
```

**Final recomputation order (reversed):**
```
[countAtom, doubleAtom, quadAtom, sumAtom]
```

Perfect! Dependencies before dependents. ✅

---

## Why This Works

**Key insight:** Post-order DFS traversal

In a DFS, we visit nodes in this order:
1. Visit node
2. Visit all children (recursively)
3. **Process node** ← This is post-order

By processing nodes AFTER visiting their children (dependents), we ensure that:
- All dependents are processed first
- Then we process the node itself
- This gives us reverse topological order

**Reversing the list** gives us topological order (dependencies before dependents).

---

## Optimization: Skip Unchanged Atoms

```typescript
// Before recomputing, check if dependencies actually changed
let hasChangedDeps = false;
for (const dep of aState.d.keys()) {
  if (dep !== a && changedAtoms.has(dep)) {
    hasChangedDeps = true;
    break;
  }
}

if (hasChangedDeps) {
  readAtomState(store, a);  // Only recompute if needed
}
```

**Example where this helps:**
```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const unrelatedAtom = atom(100);

// Change unrelatedAtom
store.set(unrelatedAtom, 200);

// doubleAtom is NOT in changedAtoms
// So we skip recomputing it
// Even though it might be in the dependency graph
```

---

## Complexity Analysis

**Time complexity: O(N + E)**
- N = number of affected atoms
- E = number of edges in the dependency subgraph
- Each atom visited once: O(N)
- Each edge traversed once: O(E)
- Total: O(N + E)

**Space complexity: O(N)**
- Stack: O(N) in worst case (deep dependency chain)
- Visiting set: O(N)
- Visited set: O(N)
- Result array: O(N)
- Total: O(N)

**Comparison with alternatives:**

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| Naive (recompute all) | O(A) | O(1) | A = total atoms |
| BFS + level sorting | O(N + E) | O(N) | Requires level tracking |
| DFS (Jotai's approach) | O(N + E) | O(N) | Simpler implementation |
| Kahn's algorithm | O(N + E) | O(N) | Requires in-degree tracking |

---

## Code Snippet for Blog

```typescript
/**
 * Recompute invalidated atoms in topological order.
 * 
 * Uses DFS to build a reverse topological sort, then processes
 * atoms in reverse order (dependencies before dependents).
 * 
 * Time: O(N + E) where N = affected atoms, E = edges
 * Space: O(N)
 */
function recomputeInvalidatedAtoms(store: Store) {
  const topSortedReversed: [AnyAtom, AtomState][] = [];
  const visiting = new WeakSet<AnyAtom>();
  const visited = new WeakSet<AnyAtom>();
  const stack: AnyAtom[] = Array.from(changedAtoms);
  
  // DFS to build reverse topological order
  while (stack.length) {
    const atom = stack[stack.length - 1]!;
    const atomState = ensureAtomState(store, atom);
    
    if (visited.has(atom)) {
      stack.pop();
      continue;
    }
    
    if (visiting.has(atom)) {
      // Post-order: add after visiting all dependents
      if (invalidatedAtoms.get(atom) === atomState.n) {
        topSortedReversed.push([atom, atomState]);
      }
      visited.add(atom);
      stack.pop();
      continue;
    }
    
    visiting.add(atom);
    
    // Visit all dependents
    for (const dependent of getDependents(atom, atomState)) {
      if (!visiting.has(dependent)) {
        stack.push(dependent);
      }
    }
  }
  
  // Recompute in topological order (reverse of the list)
  for (let i = topSortedReversed.length - 1; i >= 0; --i) {
    const [atom, atomState] = topSortedReversed[i]!;
    
    // Optimization: skip if dependencies didn't change
    if (hasChangedDependencies(atom, atomState)) {
      readAtomState(store, atom);
      mountDependencies(store, atom);
    }
    
    invalidatedAtoms.delete(atom);
  }
}
```

---

## Takeaways for Your Blog

1. **Start with the problem** - Show why order matters with a concrete example
2. **Explain the algorithm** - Step-by-step with clear variable names
3. **Visual walkthrough** - Trace through a real example
4. **Explain why it works** - Post-order DFS insight
5. **Show optimizations** - Skip unchanged atoms
6. **Analyze complexity** - Compare with alternatives
7. **Provide clean code** - Well-commented snippet

This section will be the technical highlight of your blog! 🚀

