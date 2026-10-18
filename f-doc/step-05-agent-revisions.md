# Frontend Step 5: Revision Planner & AI Agent Recommendations

**Current Status**: Backend Phase 5 & 6 are LIVE (`/api/agent/recommendation` & `/api/revisions`)  
**Assigned To**: **Friend 2 (Mouni / Member B)**  
**Target Components**:
1. `frontend/src/services/api/revisionsApi.js`
2. `frontend/src/components/revisions/TodayRecommendationCard.jsx`
3. `frontend/src/components/revisions/ProceduralChecklist.jsx`
4. `frontend/src/components/revisions/RevisionHistoryList.jsx`
5. `frontend/src/views/PlannerView.jsx` (assembly)

---

## 1. Backend Endpoint Specifications

### A. Ask AI Agent for Personalized Recommendation
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/agent/recommendation`
- **Headers**:
  ```http
  Content-Type: application/json
  x-user-id: demo-user
  ```
- **Response Example (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "decision": "REVISE_WEAK_PATTERN",
    "headline": "Priority Revision: Strengthen Two Pointers",
    "targetPattern": "two-pointers",
    "targetPatternName": "Two Pointers",
    "reasoning": "You had repeated duplicate-handling mistakes in Two Pointers problems (2 times). Review the pattern and solve one targeted problem before moving forward.",
    "evidence": [
      "Two Pointers: 40% success rate across 5 attempts",
      "Repeated mistake 'Duplicate Handling' occurred 2 times in Two Pointers"
    ],
    "actionableTask": {
      "problemRecommendation": "Solve 1 targeted Medium problem in Two Pointers focusing on error prevention.",
      "proceduralChecklist": [
        "Sort the array beforehand so identical elements are contiguous.",
        "After recording a valid answer, advance the pointer past all identical neighbors: while (left < right && nums[left] === nums[left + 1]) left++;",
        "For outer loops (e.g. 3Sum), skip outer duplicate if (i > 0 && nums[i] === nums[i - 1]) continue;",
        "Verify termination condition: while (left < right) vs while (left <= right) to avoid index overflow."
      ]
    },
    "revisionTaskCreated": true,
    "mode": "deterministic-fallback"
  }
}
```

---

### B. Retrieve Revision Tasks
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/revisions`
- **Optional Query**: `?status=PENDING` or `?status=COMPLETED`
- **Headers**: `x-user-id: demo-user`
- **Response Example (`200 OK`)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "rev_1792312000000_abc123",
      "patternId": "two-pointers",
      "patternName": "Two Pointers",
      "reason": "Repeated Duplicate Handling mistakes detected",
      "recommendation": "Review two-pointers duplicate skipping template",
      "checklist": [
        "Sort the array beforehand",
        "Skip duplicates with while loop",
        "Verify pointer bounds"
      ],
      "focusProblem": "Targeted Two Pointers refresher problem",
      "status": "PENDING",
      "source": "agent",
      "reflectionNotes": "",
      "createdAt": "2026-10-18T08:50:00.000Z",
      "completedAt": null
    }
  ]
}
```

---

### C. Update Revision Task Status (Mark Completed)
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/revisions/:id`
- **Headers**:
  ```http
  Content-Type: application/json
  x-user-id: demo-user
  ```
- **Request Body JSON**:
```json
{
  "status": "COMPLETED",
  "reflectionNotes": "Solved 3Sum without looking at hints. Duplicate skipping condition is now clear."
}
```

---

## 2. Copy-Pasteable Frontend Service (`frontend/src/services/api/revisionsApi.js`)

```javascript
import { apiRequest } from './client'

export async function fetchAgentRecommendation() {
  try {
    const res = await apiRequest('/api/agent/recommendation', { method: 'POST', body: {} })
    return res.data
  } catch (error) {
    console.warn('Agent API unavailable, using mock fallback', error)
    return MOCK_AGENT_RECOMMENDATION
  }
}

export async function fetchRevisions(status = null) {
  const query = status ? `?status=${status}` : ''
  const res = await apiRequest(`/api/revisions${query}`)
  return res.data || []
}

export async function completeRevision(revisionId, reflectionNotes = '') {
  return await apiRequest(`/api/revisions/${revisionId}`, {
    method: 'PATCH',
    body: { status: 'COMPLETED', reflectionNotes },
  })
}

export const MOCK_AGENT_RECOMMENDATION = {
  decision: 'REVISE_WEAK_PATTERN',
  headline: 'Priority Revision: Strengthen Two Pointers',
  targetPattern: 'two-pointers',
  targetPatternName: 'Two Pointers',
  reasoning: 'You had repeated duplicate-handling mistakes in Two Pointers problems (2 times). Review the pattern and solve one targeted problem before moving forward.',
  evidence: [
    'Two Pointers: 40% success rate across 5 attempts',
    "Repeated mistake 'Duplicate Handling' occurred 2 times in Two Pointers",
  ],
  actionableTask: {
    problemRecommendation: 'Solve 1 targeted Medium problem in Two Pointers focusing on error prevention.',
    proceduralChecklist: [
      'Sort the array beforehand so identical elements are contiguous.',
      'After recording a valid answer, advance the pointer past all identical neighbors: while (left < right && nums[left] === nums[left + 1]) left++;',
      'For outer loops (e.g. 3Sum), skip outer duplicate if (i > 0 && nums[i] === nums[i - 1]) continue;',
      'Verify termination condition: while (left < right) to avoid index overflow.',
    ],
  },
  revisionTaskCreated: true,
  mode: 'deterministic-fallback',
}
```

---

## 3. UI Blueprint for Member B (`views/PlannerView.jsx`)

1. **Top Recommendation Hero Card (`TodayRecommendationCard.jsx`)**:
   - Clean card (`bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-xs`).
   - Pill Badge:
     - `REVISE_WEAK_PATTERN` $\rightarrow$ Terracotta / Amber (`bg-[#FCE8E1] text-[#D97757] font-semibold text-xs px-2.5 py-1 rounded-full`).
     - `CONTINUE_NEW_TOPIC` $\rightarrow$ Mint green (`bg-[#98D8B0]/30 text-[#123824] font-semibold text-xs px-2.5 py-1 rounded-full`).
   - Title: `Headline` in bold walnut brown (`text-xl font-bold text-[#1C1C1C]`).
   - Grounded Reasoning paragraph citing verified numbers.
   - Evidence Chips container listing the retrieved facts.
   - Action Button: Mint green `Run Agent Analysis` button to refresh recommendations anytime!

2. **Interactive Procedural Checklist (`ProceduralChecklist.jsx`)**:
   - Displays actionable checkboxes for the recommended steps.
   - Checking a step strikes through the text with a soft green checkmark.
   - "Mark Revision Completed" action: Opens a clean reflection modal asking:
     - *"What did you learn from this revision?"*
     - Saves reflection notes to the backend via `PATCH /api/revisions/:id`.

3. **Past Revision History Table (`RevisionHistoryList.jsx`)**:
   - Lists completed and pending revisions with timestamp, target pattern, status badge, and user reflection notes.

---

## 4. What's Next?
All backend modules (Phases 1 through 6) are now complete and verified!
Backend will now implement **Phase 7 (Realistic Sample Seed Script `npm run seed`)** so your team can populate full demonstration data anytime with one command!
