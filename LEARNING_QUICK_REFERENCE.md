# Learning Quick Reference Card

Keep this open while implementing. Use these techniques after EVERY milestone.

---

## ⚡ Minimum Viable Learning (15 min per milestone)

### 1. Feynman Explanation (5 min)
**Close your code. Explain out loud or write:**
- What does this do?
- How does it work?
- Why this approach?

**If you can't explain it clearly, you don't understand it yet.**

### 2. Three Why Questions (5 min)
**Ask and answer:**
1. Why did I implement it this way?
2. Why not [alternative approach]?
3. What would break if I changed [key decision]?

### 3. Confidence Check (5 min)
**Rate yourself (1-5):**
- Understanding: Could I explain this?
- Implementation: Could I code this from memory?
- Application: Could I use this pattern elsewhere?

**If any score < 4, review before moving on.**

---

## 🎯 Before Starting Each Milestone

**Preview (2 min):**
- Read the milestone description
- Predict: "I think I'll implement this by..."
- Identify: "The tricky part will be..."

**Activate Prior Knowledge (1 min):**
- "This is similar to..."
- "I can use the pattern from..."

---

## 💡 While Implementing

**Think Aloud:**
- Narrate your decisions: "I'm doing X because Y"
- Predict before running: "This should output Z"
- Notice surprises: "Interesting, I expected X but got Y"

**Test Understanding:**
- Before running code, predict the output
- If wrong, understand why
- Don't just fix and move on

---

## ✅ After Completing Each Milestone

### Quick Checklist (2 min)

Can you answer YES to all of these?

- [ ] I can explain this without looking at code
- [ ] I know why I chose this approach
- [ ] I can predict what happens in edge cases
- [ ] I understand the trade-offs
- [ ] I see how this connects to previous work

**If NO to any → Spend 5 more minutes on that aspect**

### Learning Journal Entry (10 min)

Write in `LEARNING_JOURNAL.md`:
1. What I implemented (1 sentence)
2. Key insight (1 sentence)
3. Feynman explanation (3-4 sentences)
4. Three why questions + answers
5. Confidence ratings (1-5)

---

## 🔄 Daily Learning Routine

### Start of Day (5 min)
- Review yesterday: "What did I build? What was the key insight?"
- Preview today: "What am I building? How does it connect?"

### End of Day (10 min)
- Consolidate: "What did I learn today?"
- Pattern: "What principle emerged?"
- Tomorrow: "What's next? What questions do I have?"

---

## 📅 Weekly Learning Routine

### End of Week (30 min)

**1. Big Picture (10 min):**
- Draw the entire system from memory
- Explain the flow end-to-end
- Identify fuzzy areas

**2. From Memory Test (10 min):**
- Pick a key function
- Implement it from scratch without looking
- Compare with your implementation
- Note what you forgot

**3. Teach Someone (10 min):**
- Explain one concept to someone
- Or write a detailed explanation
- Or record a video

---

## 🚩 Red Flags: Shallow Learning

Stop and reflect if you notice:

- ❌ "It works, so I'm done" (without knowing why)
- ❌ Can't explain without looking at code
- ❌ Don't know why you made certain choices
- ❌ Can't predict behavior before testing
- ❌ Moving fast but not understanding

**Fix: Use Feynman Technique + Why Questions**

---

## 🎓 Deep Learning Indicators

You're learning deeply when:

- ✅ Can explain concepts clearly without notes
- ✅ Can implement key parts from memory
- ✅ Can predict behavior before testing
- ✅ Can answer "why" questions confidently
- ✅ See connections to other patterns
- ✅ Can identify trade-offs
- ✅ Could teach this to someone

---

## 🔧 Practical Exercises

### After Each Phase (30 min)

**Phase 1 (Reading Atoms):**
- [ ] Implement `store.get()` from memory
- [ ] Draw data flow diagram
- [ ] Explain dependency tracking to someone

**Phase 2 (Writing Atoms):**
- [ ] Implement topological sort from memory
- [ ] Draw invalidation wave diagram
- [ ] Explain why order matters

**Phase 3 (Subscriptions):**
- [ ] Implement subscription system from memory
- [ ] Draw notification flow diagram
- [ ] Explain connection to Observer pattern

---

## 💭 Powerful Questions to Ask

### Understanding
- "How would I explain this to a beginner?"
- "What's the simplest example that demonstrates this?"
- "What's the underlying principle?"

### Design
- "Why this approach instead of alternatives?"
- "What are the trade-offs?"
- "What would break if I changed X?"

### Connections
- "Where have I seen this pattern before?"
- "How is this similar to [other concept]?"
- "Where else could I apply this?"

### Application
- "Could I implement this from memory?"
- "Could I debug issues in this code?"
- "Could I extend this to handle [new requirement]?"

---

## 📊 Learning Metrics

Track after each milestone:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Understanding | 4-5/5 | Can explain clearly |
| Implementation | 4-5/5 | Can code from memory |
| Explanation | 4-5/5 | Can teach others |
| Application | 4-5/5 | Can use pattern elsewhere |

**Don't move on until all metrics ≥ 4/5**

---

## 🎯 Learning Goals by Phase

### Phase 1: Reading Atoms
**Internalize:**
- How primitive vs derived atoms differ
- How dependency tracking works (context pattern)
- Why dependencies are tracked during execution

**Can you:**
- Explain why we need a "current atom" context?
- Draw the dependency graph for a complex atom?
- Predict which dependencies will be tracked?

### Phase 2: Writing Atoms
**Internalize:**
- How change propagation works (BFS for invalidation)
- How topological sort ensures correct order (DFS)
- Why we need both algorithms

**Can you:**
- Explain why BFS for invalidation and DFS for sorting?
- Draw the recomputation order for a complex graph?
- Identify what would break without topological sort?

### Phase 3: Subscriptions
**Internalize:**
- How the Observer pattern applies
- How subscriptions connect to React re-rendering
- Why we notify dependents too

**Can you:**
- Explain the subscription lifecycle?
- Draw the notification flow?
- Connect this to React's useState?

---

## 🧠 Memory Techniques

### Spaced Repetition Schedule
- **Day 1:** Implement
- **Day 2:** Review and quiz yourself
- **Day 4:** Quiz yourself again
- **Week 2:** Implement from memory

### Active Recall
Instead of re-reading code:
1. Close the file
2. Try to write the key function from memory
3. Check against your implementation
4. Understand any gaps

### Elaborative Encoding
Connect new learning to existing knowledge:
- "This is like React's useEffect because..."
- "This is different from Redux because..."
- "This uses the same pattern as..."

---

## ⏱️ Time Budget

**Per Milestone:**
- Implementation: 1-2 hours
- Learning activities: 15-30 min
- **Total: 1.5-2.5 hours**

**The learning activities are NOT optional overhead.**
**They're what ensure you actually internalize the patterns.**

---

## 🎯 Success Criteria

**You're ready to move on when:**

1. ✅ You can explain the concept clearly (Feynman test)
2. ✅ You can answer "why" questions confidently
3. ✅ You can predict behavior without running code
4. ✅ You see connections to other patterns
5. ✅ Your confidence ratings are all ≥ 4/5

**You're NOT ready if:**

1. ❌ You can't explain without looking at code
2. ❌ You don't know why you made certain choices
3. ❌ You're surprised by the behavior
4. ❌ You don't see how this connects to anything
5. ❌ Any confidence rating < 4/5

---

## 🚀 Start Now

After completing your next milestone:

1. **Close your code**
2. **Explain it out loud** (Feynman)
3. **Ask three "why" questions**
4. **Rate your confidence** (1-5)
5. **Write in learning journal**

**Total time: 15 minutes**
**Value: Deep understanding vs shallow completion**

---

## 💡 Remember

**"I can make it work" ≠ "I understand it"**

The goal isn't just to build mini-jotai.
The goal is to internalize the patterns so deeply that you can:
- Explain them clearly in your blog
- Apply them to other problems
- Teach them to others
- Remember them months later

**Invest the 15 minutes per milestone. Your future self will thank you.** 🧠

