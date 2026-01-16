# Introduction Section - Draft

## Hook (Strong opening)

When you write this code in Jotai:

```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const quadAtom = atom((get) => get(doubleAtom) * 2);

// Later, in a React component:
const [count, setCount] = useAtom(countAtom);
```

Something remarkable happens behind the scenes. Jotai:
- Knows that `doubleAtom` depends on `countAtom`
- Knows that `quadAtom` depends on `doubleAtom`
- Recomputes them in the correct order when `countAtom` changes
- Only recomputes what actually changed
- Does all this automatically, with zero configuration

**You never told Jotai about these dependencies.** You never registered a subscription. You never called `atom.dependsOn(otherAtom)`. Yet it just works.

How?

---

## The Mystery

Let's make this more concrete. Consider this example:

```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const quadAtom = atom((get) => get(doubleAtom) * 2);
const sumAtom = atom((get) => get(countAtom) + get(doubleAtom));

// Initial state:
// countAtom = 0
// doubleAtom = 0
// quadAtom = 0
// sumAtom = 0

// Now update countAtom:
setCount(5);

// Jotai automatically:
// 1. Updates countAtom to 5
// 2. Recomputes doubleAtom: 5 * 2 = 10
// 3. Recomputes quadAtom: 10 * 2 = 20
// 4. Recomputes sumAtom: 5 + 10 = 15
//
// In the CORRECT ORDER
// Without recomputing unrelated atoms
// In a single synchronous update
```

**Questions this raises:**
1. How does Jotai know that `doubleAtom` depends on `countAtom`?
2. How does it know to recompute `doubleAtom` before `quadAtom`?
3. How does it avoid recomputing atoms that didn't change?
4. How does it do all this efficiently?

---

## Why This Matters

Understanding Jotai's dependency tracking is valuable for several reasons:

**For Jotai users:**
- Understand performance characteristics
- Debug unexpected behavior
- Write more efficient atom compositions
- Appreciate the magic (it's not actually magic!)

**For library authors:**
- Learn elegant patterns for reactive systems
- Understand trade-offs in state management
- See how to build developer-friendly APIs
- Study production-quality code architecture

**For anyone interested in algorithms:**
- Real-world application of graph algorithms
- Topological sorting in practice
- Performance optimization techniques
- Clean code patterns

---

## What We'll Cover

In this deep dive, we'll explore:

1. **The naive approach** - Why you can't just recompute everything
2. **Dependency tracking** - How Jotai builds the dependency graph
3. **Change propagation** - The invalidation algorithm
4. **Topological sorting** - Ensuring correct recomputation order
5. **Performance analysis** - Time and space complexity
6. **Design lessons** - What we can learn from Jotai's implementation

We'll be reading the **actual Jotai source code** from the production repository. No simplified examples—we're going straight to the real implementation.

---

## Prerequisites

To get the most out of this article, you should:

- Be comfortable with TypeScript
- Understand basic React hooks
- Have used Jotai (or similar state management libraries)
- Know basic graph terminology (nodes, edges, dependencies)

You don't need to know:
- Advanced graph algorithms (we'll explain topological sort)
- Jotai internals (that's what we're learning!)
- Reactive programming theory (we'll cover what's needed)

---

## A Note on Complexity

Jotai's source code is surprisingly readable, but it handles many edge cases:
- Async atoms and Suspense
- Conditional dependencies
- Circular dependency detection
- Memory management
- Error handling
- DevTools integration

For clarity, we'll focus on the **core dependency tracking mechanism** and simplify some details. The patterns we discuss are all from the real source code, but we'll skip some of the production complexity.

If you want to see the full implementation, check out:
- [`atom.ts`](https://github.com/pmndrs/jotai/blob/main/src/vanilla/atom.ts) - Atom creation
- [`internals.ts`](https://github.com/pmndrs/jotai/blob/main/src/vanilla/internals.ts) - Store implementation

---

## Let's Dive In

Ready to see how the magic works? Let's start with the naive approach and see why it fails...

---

## Alternative Hooks (Choose One)

### Option 1: The Performance Hook
```typescript
// This innocent-looking code:
const sumAtom = atom((get) => {
  return get(atom1) + get(atom2) + get(atom3);
});

// Could be implemented naively as:
// "Recompute sumAtom whenever ANY atom changes"
// 
// But if you have 1000 atoms, that means:
// - 997 unnecessary recomputations
// - Wasted CPU cycles
// - Janky UI
//
// Jotai is smarter than that.
```

### Option 2: The Comparison Hook
```typescript
// In Redux, you write:
const mapStateToProps = (state) => ({
  count: state.count,
  double: state.count * 2,
});

// You explicitly tell Redux what state you need.
//
// In Jotai, you write:
const doubleAtom = atom((get) => get(countAtom) * 2);

// No explicit dependencies. Jotai figures it out.
// How?
```

### Option 3: The Bug Hook
```typescript
// Imagine if Jotai got the order wrong:

const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const quadAtom = atom((get) => get(doubleAtom) * 2);

setCount(5);

// Wrong order:
// 1. Recompute quadAtom first
//    → get(doubleAtom) returns OLD value (0)
//    → quadAtom = 0 * 2 = 0 ❌
// 2. Recompute doubleAtom
//    → doubleAtom = 5 * 2 = 10 ✓
// 3. Now quadAtom is stale again!
//
// Jotai never makes this mistake. How does it ensure correct order?
```

---

## Tone and Style Notes

**For the introduction:**
- Start with concrete code examples
- Build curiosity with questions
- Promise practical insights
- Set expectations clearly
- Keep it conversational but technical

**Avoid:**
- Too much theory upfront
- Vague statements like "Jotai is fast"
- Assuming too much knowledge
- Being condescending ("obviously...")
- Too much hype ("revolutionary", "game-changing")

**Aim for:**
- Specific, verifiable claims
- Clear code examples
- Genuine curiosity
- Respect for the reader's intelligence
- Enthusiasm without hype

---

## SEO Optimization

**Title options:**
1. "How Jotai Tracks Dependencies: A Deep Dive into the Source Code"
2. "Inside Jotai's Dependency Tracking: Algorithms and Implementation"
3. "Understanding Jotai's Reactive System: A Technical Deep Dive"

**Meta description:**
"Explore how Jotai automatically tracks atom dependencies, propagates changes efficiently, and ensures correct recomputation order. A deep dive into the source code with algorithms, complexity analysis, and design lessons."

**Keywords to include naturally:**
- Jotai dependency tracking
- React state management internals
- Topological sort algorithm
- Reactive programming patterns
- Jotai source code analysis
- State management performance
- Dependency graph algorithms

---

## Call-to-Action Ideas

**End of introduction:**
- "Let's start by looking at the naive approach and why it fails..."
- "First, we need to understand how Jotai tracks dependencies..."
- "To understand the solution, let's first understand the problem..."

**Throughout the article:**
- "Try this in your browser console..."
- "Pause here and think: how would YOU solve this?"
- "Check out the source code here: [link]"

**End of article:**
- "Want to learn more? Build your own mini-jotai: [link]"
- "Explore the full source code: [link]"
- "Share your insights on Twitter: [link]"

