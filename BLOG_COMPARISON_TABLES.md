# Comparison Tables for Blog Post

These tables will help readers understand Jotai's approach in context.

---

## Table 1: Dependency Tracking Approaches

| Approach | How It Works | Pros | Cons | Used By |
|----------|--------------|------|------|---------|
| **Manual Subscriptions** | Developer explicitly subscribes to state changes | Simple to implement | Error-prone, verbose, easy to forget | Redux (connect), Zustand (subscribe) |
| **Selector Functions** | Developer specifies what state to read | Explicit dependencies | Must manually optimize with memoization | Redux (useSelector), Recoil (selectors) |
| **Automatic Tracking** | Library tracks dependencies during execution | Zero boilerplate, automatic optimization | More complex implementation | Jotai, MobX, Solid.js |
| **Reactive Primitives** | Special reactive values that track access | Fine-grained reactivity | Different mental model | Vue (ref), Solid (signals) |

**Jotai's choice:** Automatic tracking via the `get` function.

---

## Table 2: Change Propagation Strategies

| Strategy | Description | Time Complexity | Space Complexity | Trade-offs |
|----------|-------------|-----------------|------------------|------------|
| **Recompute All** | Recompute every atom on any change | O(A) | O(1) | Simple but wasteful |
| **Dirty Checking** | Compare all values to detect changes | O(A × V) | O(A) | Works with any values, but slow |
| **Dependency Graph** | Track dependencies, recompute affected | O(N + E) | O(A × D) | Optimal for sparse graphs |
| **Push-based (Observables)** | Push changes through dependency chain | O(N) | O(A × D) | Fast but can cause glitches |
| **Pull-based (Lazy)** | Recompute only when value is read | O(1) write, O(D) read | O(A × D) | Great for rarely-read atoms |

**Jotai's choice:** Dependency graph with pull-based evaluation.

**Legend:**
- A = total number of atoms
- N = number of affected atoms
- E = number of edges in dependency subgraph
- D = average number of dependencies per atom
- V = cost of value comparison

---

## Table 3: Recomputation Order Algorithms

| Algorithm | Description | Time | Space | Pros | Cons |
|-----------|-------------|------|-------|------|------|
| **No ordering** | Recompute in arbitrary order | O(N) | O(1) | Simple | May need multiple passes |
| **Level-based BFS** | Group by dependency depth | O(N + E) | O(N) | Intuitive | Requires level tracking |
| **Kahn's Algorithm** | Topological sort via in-degrees | O(N + E) | O(N) | Well-known | Requires in-degree tracking |
| **DFS Post-order** | Topological sort via DFS | O(N + E) | O(N) | Simple, no extra tracking | Requires recursion/stack |

**Jotai's choice:** DFS post-order (what they actually use in production).

---

## Table 4: State Management Library Comparison

| Library | Dependency Tracking | Change Propagation | Recomputation Order | Memory Management |
|---------|---------------------|-------------------|---------------------|-------------------|
| **Redux** | Manual (selectors) | Notify all subscribers | N/A (computed in components) | Manual cleanup |
| **Zustand** | Manual (selectors) | Notify all subscribers | N/A (computed in components) | Manual cleanup |
| **Recoil** | Automatic (get) | Dependency graph | Topological sort | WeakMap (automatic GC) |
| **Jotai** | Automatic (get) | Dependency graph | Topological sort | WeakMap (automatic GC) |
| **MobX** | Automatic (observables) | Push-based | Immediate propagation | Automatic (with caveats) |
| **Valtio** | Automatic (proxy) | Push-based | Immediate propagation | Manual cleanup |

**Key similarities:** Jotai and Recoil use very similar approaches.

**Key difference:** Jotai is simpler and more lightweight than Recoil.

---

## Table 5: Performance Characteristics

| Operation | Naive | Jotai | Best Case | Worst Case |
|-----------|-------|-------|-----------|------------|
| **Read atom (cached)** | O(1) | O(1) | O(1) | O(1) |
| **Read atom (compute)** | O(D) | O(D) | O(1) | O(A) |
| **Write primitive atom** | O(A) | O(N + E) | O(1) | O(A + E) |
| **Write derived atom** | O(A) | O(N + E) | O(1) | O(A + E) |
| **Subscribe** | O(1) | O(D) | O(1) | O(A) |
| **Unsubscribe** | O(1) | O(D) | O(1) | O(A) |

**Legend:**
- A = total atoms
- D = dependencies of this atom
- N = affected atoms
- E = edges in affected subgraph

**When Jotai is faster:**
- Sparse dependency graphs (most real-world apps)
- Frequent reads, infrequent writes
- Many atoms, few dependencies each

**When naive is faster:**
- Very few atoms (< 10)
- Dense dependency graphs (everything depends on everything)
- Extremely frequent writes

---

## Table 6: Memory Usage Comparison

| Approach | Per-Atom Overhead | Total Memory | GC Behavior |
|----------|-------------------|--------------|-------------|
| **Naive (no tracking)** | O(1) | O(A) | Manual cleanup needed |
| **Jotai (WeakMap)** | O(D + T) | O(A × (D + T)) | Automatic GC |
| **MobX (observables)** | O(D + T) | O(A × (D + T)) | Automatic GC (mostly) |
| **Redux (no tracking)** | O(1) | O(A) | Manual cleanup needed |

**Legend:**
- A = number of atoms
- D = average dependencies per atom
- T = average dependents per atom

**Jotai's trade-off:**
- Higher memory usage per atom (tracks dependencies)
- But automatic garbage collection (WeakMap)
- Net benefit: no memory leaks, no manual cleanup

---

## Table 7: Real-World Performance Example

Scenario: 1000 atoms, average 3 dependencies each, update 1 atom affecting 10 dependents.

| Metric | Naive | Jotai | Improvement |
|--------|-------|-------|-------------|
| **Atoms recomputed** | 1000 | 10 | 100x fewer |
| **Time (estimated)** | 100ms | 1ms | 100x faster |
| **Memory reads** | 3000 | 30 | 100x fewer |
| **React re-renders** | 1000 | 10 | 100x fewer |

**Assumptions:**
- 0.1ms per atom recomputation
- Linear scaling (no overhead)
- All atoms are subscribed

**Real-world factors:**
- Actual recomputation time varies
- React batching helps both approaches
- Network/async operations dominate in practice

---

## Table 8: Design Pattern Comparison

| Pattern | Jotai's Approach | Alternative | Trade-off |
|---------|------------------|-------------|-----------|
| **State storage** | WeakMap | Map | Auto GC vs manual cleanup |
| **Change detection** | Epoch numbers | Value comparison | O(1) vs O(V) |
| **Dependency tracking** | During read | Explicit declaration | Automatic vs explicit |
| **Atom identity** | Object reference | String key | Type-safe vs serializable |
| **Computation** | Pull-based | Push-based | Lazy vs eager |
| **API surface** | Minimal (3 functions) | Rich (many utilities) | Simple vs feature-rich |

---

## Table 9: When to Use What

| Scenario | Best Choice | Why |
|----------|-------------|-----|
| **Simple global state** | Zustand | Simpler, less overhead |
| **Complex derived state** | Jotai | Automatic dependency tracking |
| **Large-scale app** | Jotai or Recoil | Scales well, automatic optimization |
| **Fine-grained reactivity** | Solid.js signals | Most efficient updates |
| **Existing Redux app** | Redux Toolkit | Migration cost too high |
| **Server state** | React Query | Purpose-built for async data |
| **Form state** | React Hook Form | Purpose-built for forms |
| **Learning project** | Jotai | Clean, readable source code |

---

## Table 10: Complexity Analysis Summary

| Algorithm | Best Case | Average Case | Worst Case | Space |
|-----------|-----------|--------------|------------|-------|
| **Read (cached)** | Θ(1) | Θ(1) | Θ(1) | O(1) |
| **Read (compute)** | Θ(1) | Θ(D) | Θ(A) | O(D) |
| **Write** | Θ(1) | Θ(N + E) | Θ(A + E) | O(N) |
| **Invalidate** | Θ(1) | Θ(N) | Θ(A) | O(N) |
| **Topological sort** | Θ(N) | Θ(N + E) | Θ(A + E) | O(N) |
| **Subscribe** | Θ(1) | Θ(D) | Θ(A) | O(1) |

**Legend:**
- Θ = tight bound (best, average, worst are same)
- O = upper bound
- A = total atoms
- D = dependencies
- N = affected atoms
- E = edges in subgraph

---

## How to Use These Tables in Your Blog

1. **Don't include all tables** - Choose 3-4 most relevant
2. **Place strategically** - After explaining the concept
3. **Reference in text** - "As shown in Table 2..."
4. **Add captions** - Explain what the table shows
5. **Keep formatting simple** - Markdown tables are fine
6. **Highlight key cells** - Use bold for important values
7. **Add footnotes** - Explain abbreviations and assumptions

## Recommended Tables for Your Blog

**Must include:**
- Table 2: Change Propagation Strategies (shows Jotai's choice)
- Table 5: Performance Characteristics (concrete numbers)
- Table 10: Complexity Analysis Summary (technical depth)

**Nice to have:**
- Table 1: Dependency Tracking Approaches (context)
- Table 7: Real-World Performance Example (practical impact)

**Skip:**
- Tables 4, 6, 8, 9 (too broad, not focused on dependency tracking)

