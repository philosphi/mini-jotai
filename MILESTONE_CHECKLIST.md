# Milestone Completion Checklist

Print this or keep it open. Check off each item before moving to the next milestone.

---

## Before Starting

- [ ] Read milestone description in IMPLEMENTATION_ROADMAP.md
- [ ] Predict: "I think I'll implement this by..."
- [ ] Identify: "The tricky part will be..."
- [ ] Connect: "This is similar to..."

---

## During Implementation

- [ ] Think aloud: Narrate your decisions
- [ ] Predict before running: "This should output..."
- [ ] Test prediction: Run and compare
- [ ] Understand surprises: "I expected X but got Y because..."

---

## After Implementation (Minimum 15 min)

### 1. Feynman Test (5 min)
- [ ] Close your code
- [ ] Explain out loud or write down:
  - What does this do?
  - How does it work?
  - Why this approach?
- [ ] If you struggled, review and try again

### 2. Three Why Questions (5 min)
- [ ] Q1: Why did I implement it this way?
- [ ] Q2: Why not [alternative approach]?
- [ ] Q3: What would break if I changed [key decision]?

### 3. Confidence Check (5 min)
- [ ] Rate Understanding (1-5): ___
- [ ] Rate Implementation (1-5): ___
- [ ] Rate Explanation (1-5): ___
- [ ] All ratings ≥ 4? If NO, spend 10 more minutes

---

## Deep Learning Activities (Optional but Recommended, +15 min)

### 4. Try a Variation (10 min)
- [ ] Modify the implementation in a small way
- [ ] Predict what will happen
- [ ] Test your prediction
- [ ] Understand any surprises

### 5. Learning Journal Entry (10 min)
- [ ] What I implemented (1 sentence)
- [ ] Key insight (1 sentence)
- [ ] Feynman explanation (3-4 sentences)
- [ ] Three why Q&A
- [ ] Pattern identified
- [ ] Connection to other knowledge
- [ ] Confidence ratings

---

## Ready to Move On?

Answer YES to all before proceeding:

- [ ] I can explain this without looking at code
- [ ] I know why I chose this approach
- [ ] I can predict what happens in edge cases
- [ ] I understand the trade-offs
- [ ] I see how this connects to previous work
- [ ] All confidence ratings ≥ 4/5

**If any NO → Spend 10 more minutes on that aspect**

---

## Milestone-Specific Checks

### Milestone 1.2: Read Primitive Atoms
- [ ] Can explain: How do we distinguish primitive from derived atoms?
- [ ] Can explain: Why do we cache the value?
- [ ] Can explain: What's stored in AtomState?

### Milestone 1.3: Read Derived Atoms
- [ ] Can explain: What is the getter function?
- [ ] Can explain: Why is atom.read() called with getter?
- [ ] Can explain: When is the value computed?

### Milestone 1.4: Track Dependencies
- [ ] Can explain: How does the currentAtom context work?
- [ ] Can explain: Why track both forward and backward dependencies?
- [ ] Can explain: When are dependencies recorded?
- [ ] Can draw: Dependency graph for a complex atom

### Milestone 2.1: Basic Set
- [ ] Can explain: How does atom.write() work?
- [ ] Can explain: What's the setter function?
- [ ] Can explain: How do we update primitive atoms?

### Milestone 2.2: Invalidate Dependents
- [ ] Can explain: Why use BFS for invalidation?
- [ ] Can explain: What does "stale" mean?
- [ ] Can explain: How do we find all affected atoms?
- [ ] Can draw: Invalidation wave for a complex graph

### Milestone 2.3: Topological Sort
- [ ] Can explain: Why do we need topological sort?
- [ ] Can explain: Why use DFS instead of BFS?
- [ ] Can explain: What's post-order traversal?
- [ ] Can draw: Recomputation order for a complex graph
- [ ] Can implement: Topological sort from memory

### Milestone 2.4: Recompute Stale
- [ ] Can explain: How do invalidation and sorting work together?
- [ ] Can explain: In what order are atoms recomputed?
- [ ] Can explain: Why is order important?

### Milestone 3.1: Basic Subscription
- [ ] Can explain: How does the subscription system work?
- [ ] Can explain: When are listeners notified?
- [ ] Can explain: How does unsubscribe work?

### Milestone 3.2: Notify Dependents
- [ ] Can explain: Why notify dependent atoms' listeners?
- [ ] Can explain: How does this connect to React re-rendering?
- [ ] Can draw: Notification flow from set() to listeners

---

## Daily Checklist

### Start of Day
- [ ] Review yesterday: What did I build? Key insight?
- [ ] Preview today: What am I building? How does it connect?

### End of Day
- [ ] Consolidate: What did I learn today?
- [ ] Pattern: What principle emerged?
- [ ] Tomorrow: What's next? What questions do I have?

---

## Weekly Checklist

### End of Week
- [ ] Draw entire system from memory
- [ ] Explain flow end-to-end
- [ ] Identify fuzzy areas
- [ ] Implement key function from memory
- [ ] Teach one concept to someone (or write explanation)

---

## Red Flags (Stop and Reflect)

If you notice any of these, slow down:

- [ ] "It works, so I'm done" (without knowing why)
- [ ] Can't explain without looking at code
- [ ] Don't know why you made certain choices
- [ ] Can't predict behavior before testing
- [ ] Moving fast but not understanding
- [ ] Skipping learning activities to "save time"

---

## Success Indicators (You're Learning Deeply)

Celebrate when you notice:

- [ ] Can explain concepts clearly without notes
- [ ] Can implement key parts from memory
- [ ] Can predict behavior before testing
- [ ] Can answer "why" questions confidently
- [ ] See connections to other patterns
- [ ] Can identify trade-offs
- [ ] Could teach this to someone
- [ ] Excited about the patterns you're discovering

---

## Time Tracking

| Milestone | Implementation | Learning Activities | Total | Date |
|-----------|----------------|---------------------|-------|------|
| 1.1 Store Setup | ___ min | ___ min | ___ min | ____ |
| 1.2 Read Primitive | ___ min | ___ min | ___ min | ____ |
| 1.3 Read Derived | ___ min | ___ min | ___ min | ____ |
| 1.4 Track Dependencies | ___ min | ___ min | ___ min | ____ |
| 2.1 Basic Set | ___ min | ___ min | ___ min | ____ |
| 2.2 Invalidate Dependents | ___ min | ___ min | ___ min | ____ |
| 2.3 Topological Sort | ___ min | ___ min | ___ min | ____ |
| 2.4 Recompute Stale | ___ min | ___ min | ___ min | ____ |
| 3.1 Basic Subscription | ___ min | ___ min | ___ min | ____ |
| 3.2 Notify Dependents | ___ min | ___ min | ___ min | ____ |

**Target: Implementation 60-70%, Learning 30-40%**

---

## Notes & Insights

Use this space to jot down quick thoughts:

**Patterns I'm noticing:**
- 
- 
- 

**Connections to other knowledge:**
- 
- 
- 

**Questions for later:**
- 
- 
- 

**Ideas for blog post:**
- 
- 
- 

---

## Remember

**The goal isn't speed. The goal is deep understanding.**

15-30 minutes of learning activities per milestone ensures you:
- Actually understand what you built
- Can explain it in your blog
- Can apply patterns to other problems
- Remember it months later

**Don't skip the learning activities. They're the whole point.** 🧠

