# Mini-Jotai Learning Journal

Use this journal to track your learning and ensure deep understanding.

---

## Template (Copy for Each Session)

```markdown
## [Date] - [Milestone Name]

### What I Implemented
[1-2 sentences describing what you built]

### Key Insight (The "Aha!" Moment)
[The one most important thing you learned]

### Feynman Explanation
[Explain it as if teaching a beginner - 3-4 sentences]

### Why Questions & Answers
1. Q: Why [design decision]?
   A: 

2. Q: Why not [alternative approach]?
   A: 

3. Q: What would break if [variation]?
   A: 

### Variation Tried
What I tried: 
What I predicted: 
What actually happened: 
What I learned: 

### Pattern Identified
[What general pattern or principle did you discover?]

### Connection to Other Knowledge
[How does this relate to something you already know?]

### Confidence Ratings (1-5)
- Understanding: [ /5] - Do I understand the concept?
- Implementation: [ /5] - Could I implement from scratch?
- Explanation: [ /5] - Could I explain to someone else?
- Application: [ /5] - Could I apply this pattern elsewhere?

### Struggles & Breakthroughs
What was hard: 
How I overcame it: 

### Questions for Later
[Any questions you still have]

### Tomorrow's Preview
[What you'll work on next and how it connects]
```

---

## Example Entry (Milestone 1.4: Track Dependencies)

```markdown
## 2024-01-16 - Milestone 1.4: Track Dependencies

### What I Implemented
Implemented dependency tracking by maintaining a "current atom" context variable
and recording dependencies when the getter function is called during atom.read().

### Key Insight (The "Aha!" Moment)
Dependencies are tracked DURING execution, not declared upfront! The getter
function is the key - every time it's called, we record "current atom depends
on the atom being read." This is why Jotai doesn't need explicit dependency
arrays like React's useEffect.

### Feynman Explanation
When you read a derived atom, it calls its read function with a special getter.
This getter is like a spy - every time the read function calls get(someAtom),
the getter records "hey, this atom depends on someAtom." We also record the
reverse: "someAtom has this atom as a dependent." We need both directions
because when someAtom changes, we need to quickly find all its dependents.

### Why Questions & Answers
1. Q: Why track dependencies during execution instead of static analysis?
   A: Because dependencies can be conditional (if/else) or dynamic. Static
   analysis can't handle `get(condition ? atomA : atomB)`.

2. Q: Why track both forward (dependencies) and backward (dependents)?
   A: Forward is needed for recomputation (what do I need to read?). Backward
   is needed for invalidation (who needs to know I changed?).

3. Q: What would break if we only tracked forward dependencies?
   A: When an atom changes, we wouldn't know which atoms to invalidate. We'd
   have to scan ALL atoms to find dependents - O(A) instead of O(D).

### Variation Tried
What I tried: Created an atom with conditional dependencies:
  `atom((get) => get(flag) ? get(a) : get(b))`

What I predicted: Dependencies would be static (both a and b tracked)

What actually happened: Only the actually-read atom was tracked! When flag
changed, dependencies updated dynamically.

What I learned: Dependency tracking is truly dynamic. This is powerful but
means dependencies can change between reads.

### Pattern Identified
**Context Pattern**: Using a module-level variable (currentAtom) to track
execution context. This is similar to React's internal fiber tracking or
Zone.js in Angular. It allows implicit passing of context without explicit
parameters.

### Connection to Other Knowledge
This is similar to:
- React's useEffect dependency tracking (but automatic vs manual)
- MobX's observable tracking (same dynamic approach)
- Proxy-based reactivity in Vue 3 (tracks property access)
- The Observer pattern (dependents are observers)

### Confidence Ratings (1-5)
- Understanding: 5/5 - I fully understand how and why this works
- Implementation: 4/5 - Could implement with minor reference to edge cases
- Explanation: 5/5 - Could teach this clearly
- Application: 4/5 - Could apply to other reactive systems

### Struggles & Breakthroughs
What was hard: Understanding why we need the currentAtom context variable
instead of passing it as a parameter.

How I overcame it: Realized that atom.read() signature is fixed - we can't
change it to accept currentAtom. The context variable is a clever workaround
that keeps the API clean while enabling tracking.

### Questions for Later
- How does real Jotai handle circular dependencies?
- What happens if an atom's dependencies change between reads?
- Could we use a stack instead of a single variable for nested reads?

### Tomorrow's Preview
Next: Milestone 2.1 (Basic Set). This will use the dependency tracking I just
built to know which atoms to invalidate. The backward dependencies (dependents)
will be crucial here.
```

---

## Weekly Review Template

```markdown
## Week of [Date] - Weekly Review

### What I Built This Week
[Summary of all milestones completed]

### Biggest Insight
[The most important thing you learned this week]

### Patterns Identified
1. [Pattern 1]
2. [Pattern 2]
3. [Pattern 3]

### From Memory Test
[Try to implement a key function from memory - note what you remembered vs forgot]

### Connections Made
[How concepts from different milestones connect]

### What I'd Explain to Someone
[Pick one concept and write a detailed explanation]

### Areas Still Fuzzy
[What you're not 100% confident about]

### Next Week's Focus
[What you'll work on and what you want to understand deeply]
```

---

## Quick Reflection Prompts

Use these after each milestone (5 min):

**Understanding Check:**
- [ ] Can I explain this without looking at code?
- [ ] Do I know why we chose this approach?
- [ ] Can I predict what will happen in edge cases?

**Pattern Recognition:**
- [ ] What pattern did I use here?
- [ ] Where have I seen this pattern before?
- [ ] Where else could I apply this?

**Connection Building:**
- [ ] How does this relate to the previous milestone?
- [ ] How does this relate to React/other frameworks?
- [ ] What's the underlying principle?

**Confidence Assessment:**
- [ ] Could I implement this from scratch tomorrow?
- [ ] Could I teach this to someone?
- [ ] Could I debug issues in this code?

---

## Red Flag Checklist

If you answer "no" to any of these, spend more time on that milestone:

- [ ] I can explain this concept in simple terms
- [ ] I know why we chose this approach over alternatives
- [ ] I can predict behavior without running code
- [ ] I understand the trade-offs involved
- [ ] I can see how this connects to other concepts
- [ ] I could implement this from memory (with minor reference)
- [ ] I could answer questions about this confidently

---

## Learning Metrics Tracker

Track your confidence over time:

| Milestone | Understanding | Implementation | Explanation | Date |
|-----------|---------------|----------------|-------------|------|
| 1.1 Store Setup | /5 | /5 | /5 | |
| 1.2 Read Primitive | /5 | /5 | /5 | |
| 1.3 Read Derived | /5 | /5 | /5 | |
| 1.4 Track Dependencies | /5 | /5 | /5 | |
| 2.1 Basic Set | /5 | /5 | /5 | |
| 2.2 Invalidate Dependents | /5 | /5 | /5 | |
| 2.3 Topological Sort | /5 | /5 | /5 | |
| 2.4 Recompute Stale | /5 | /5 | /5 | |
| 3.1 Basic Subscription | /5 | /5 | /5 | |
| 3.2 Notify Dependents | /5 | /5 | /5 | |

**Goal: All ratings ≥ 4/5 before moving to blog writing**

---

## Notes Section

Use this space for:
- Interesting discoveries
- Debugging insights
- Performance observations
- Ideas for blog post
- Questions to research later

---

## Start Your First Entry!

Copy the template above and fill it out after completing Milestone 1.1 (Store Setup).

Remember: The goal is deep understanding, not just completion. Take the time to reflect! 🧠

