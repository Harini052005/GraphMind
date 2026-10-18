# Frontend Step 6: Demo Seed Data & End-to-End Verification

**Audience**: Shared (Harini / Member A & Mouni / Member B)  
**Backend Status**: ALL Backend Phases (1 through 7) are COMPLETE & VERIFIED ✅  

---

## 1. Instant Demo Seed Data Command

Your backend now includes a full realistic dataset ready for immediate testing!
To populate the database anytime, run this single command from the `backend/` folder:

```bash
cd backend
npm run seed
```

### What `npm run seed` Generates for `demo-user`:
- **13 Practice Attempts**:
  - `Arrays & Hashing`: 4 solved (100% success rate $\rightarrow$ **Stable** node with score 8–10).
  - `Binary Search`: 2 solved (100% success rate $\rightarrow$ **Stable** node).
  - `Recursion & Backtracking`: 2 solved, 1 failed with *Base Case Missing* ($\rightarrow$ **Needs Revision**).
  - `Two Pointers` *(The deliberate weak topic)*: 2 solved, 2 failed with **repeated "Duplicate Handling" mistakes** in *3Sum* and *4Sum* ($\rightarrow$ **Critical Weak Pattern**!).
- **1 Active Revision Task**:
  - Targets `Two Pointers` with procedural checklist for duplicate skipping.
- **AI Agent Recommendation**:
  - Immediately detects the repeated *Duplicate Handling* mistakes and provides targeted action.

---

## 2. Testing Your Frontend with the Demo Profile

Ensure your frontend sends `x-user-id: demo-user` (or set `recallgraph_user_id` in `localStorage`):

1. **Memory Graph View (Harini / Member A)**:
   - Hit `GET /api/patterns` to see nodes populated with green (*Stable*), amber (*Needs Revision*), and terracotta (*Critical*).
   - Click on the `Two Pointers` node in the canvas to see the right Inspector panel show 2 repeated *Duplicate Handling* mistakes and root-cause hints!
2. **Pattern Pulse View (Mouni / Member B)**:
   - Hit `GET /api/analytics` to see 13 total attempts, 77% success rate, and *Duplicate Handling* at the top of the Repeated Mistakes leaderboard.
3. **Revision Planner View (Mouni / Member B)**:
   - Hit `GET /api/revisions` to view the seeded *Two Pointers* revision task.
   - Click "Mark Completed" to test `PATCH /api/revisions/:id`.
   - Hit `POST /api/agent/recommendation` to see the AI agent's evidence-grounded recommendation card!

---

## 3. Complete Backend API Quick Reference

| Action | HTTP Method | Endpoint | Assigned Frontend Member |
|---|---|---|---|
| Health & Cloud Status | `GET` | `/api/health` | Header (Mouni) |
| Semantic Memory Graph | `GET` | `/api/patterns` | Graph Canvas & Inspector (Harini) |
| Log Practice Attempt | `POST` | `/api/attempts` | Attempt Modal (Mouni) |
| Practice History List | `GET` | `/api/attempts` | Attempt History (Mouni) |
| Learning Analytics & Pulse | `GET` | `/api/analytics` | Pulse Dashboard (Mouni) |
| Ask AI Agent Recommendation | `POST` | `/api/agent/recommendation` | Revision Planner (Mouni / Harini) |
| List Revision Tasks | `GET` | `/api/revisions` | Revision Planner (Mouni) |
| Complete Revision Task | `PATCH` | `/api/revisions/:id` | Revision Planner (Mouni) |
