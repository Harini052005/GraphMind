# Frontend Step 4: Pattern Pulse & Learning Analytics Dashboard

**Current Status**: Backend Phase 4 is LIVE (`GET /api/analytics`)  
**Assigned To**: **Friend 2 (Mouni / Member B)**  
**Target Components**:
1. `frontend/src/services/api/analyticsApi.js`
2. `frontend/src/components/pulse/MetricOverviewCards.jsx`
3. `frontend/src/components/pulse/WeakPatternsCard.jsx`
4. `frontend/src/components/pulse/MistakeLeaderboard.jsx`
5. `frontend/src/components/pulse/PatternMasteryTable.jsx`
6. `frontend/src/views/PulseView.jsx` (assembly)

---

## 1. Backend Endpoint Specifications

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/analytics`
- **Headers**:
  ```http
  x-user-id: demo-user
  ```
- **Description**: Computes deterministic learning progress, pattern-level mastery scores (0–10), weak pattern alerts with prerequisite root-cause hints, and repeated mistake clusters.

---

## 2. API Response JSON Structure

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalAttempted": 12,
      "totalSolved": 7,
      "totalFailed": 4,
      "totalIncomplete": 1,
      "overallSuccessRate": 58,
      "totalPracticeTimeMinutes": 310,
      "lastPracticeSession": "2026-10-18T08:05:58.610Z",
      "daysSinceLastSession": 0,
      "patternsPracticedCount": 4,
      "patternsMasteredCount": 1,
      "weakPatternsCount": 2
    },
    "weakPatterns": [
      {
        "patternId": "two-pointers",
        "patternName": "Two Pointers",
        "status": "Critical",
        "score": 4,
        "successRate": 40,
        "evidence": "Classified as Critical Weak Pattern due to low success rate of 40% and recurring 'Duplicate Handling' mistake (2x).",
        "topMistakes": [
          { "category": "Duplicate Handling", "count": 2 }
        ],
        "rootCauseCandidates": [
          {
            "prerequisiteId": "arrays-hashing",
            "prerequisiteName": "Arrays & Hashing",
            "relation": "prerequisite",
            "prerequisiteStatus": "Stable"
          }
        ],
        "recommendedAction": "Pause new topics. Review foundational mechanics and solve 1 targeted Two Pointers problem."
      }
    ],
    "patternMastery": [
      {
        "id": "arrays-hashing",
        "name": "Arrays & Hashing",
        "category": "Foundations",
        "score": 8,
        "status": "Stable",
        "evidence": "Consistently high success rate of 83% with 0 recurring mistake patterns.",
        "metrics": {
          "totalAttempts": 6,
          "solvedCount": 5,
          "failedCount": 0,
          "attemptedCount": 1,
          "successRate": 83,
          "avgTimeTakenMinutes": 18,
          "daysSinceLastAttempt": 1,
          "repeatedMistakes": []
        }
      }
    ],
    "repeatedMistakesLeaderboard": [
      {
        "category": "Duplicate Handling",
        "count": 2,
        "affectedPatterns": ["two-pointers"]
      },
      {
        "category": "Base Case Missing",
        "count": 2,
        "affectedPatterns": ["recursion-backtracking"]
      }
    ]
  }
}
```

---

## 3. Copy-Pasteable Frontend Service (`frontend/src/services/api/analyticsApi.js`)

```javascript
import { apiRequest } from './client'

export async function fetchAnalytics() {
  try {
    const res = await apiRequest('/api/analytics')
    return res.data
  } catch (error) {
    console.warn('Analytics API unavailable, using fallback mock data', error)
    return MOCK_ANALYTICS_DATA
  }
}

export const MOCK_ANALYTICS_DATA = {
  overview: {
    totalAttempted: 12,
    totalSolved: 7,
    totalFailed: 4,
    totalIncomplete: 1,
    overallSuccessRate: 58,
    totalPracticeTimeMinutes: 310,
    daysSinceLastSession: 0,
    patternsPracticedCount: 4,
    patternsMasteredCount: 1,
    weakPatternsCount: 2,
  },
  weakPatterns: [
    {
      patternId: 'two-pointers',
      patternName: 'Two Pointers',
      status: 'Critical',
      score: 4,
      successRate: 40,
      evidence: "Low success rate of 40% and recurring 'Duplicate Handling' mistake (2x).",
      topMistakes: [{ category: 'Duplicate Handling', count: 2 }],
      recommendedAction: 'Pause new topics. Review foundational mechanics and solve 1 targeted Two Pointers problem.',
    },
  ],
  patternMastery: [
    { id: 'arrays-hashing', name: 'Arrays & Hashing', score: 8, status: 'Stable', metrics: { totalAttempts: 6, solvedCount: 5, successRate: 83, avgTimeTakenMinutes: 18 } },
    { id: 'two-pointers', name: 'Two Pointers', score: 4, status: 'Critical', metrics: { totalAttempts: 5, solvedCount: 2, successRate: 40, avgTimeTakenMinutes: 28 } },
    { id: 'binary-search', name: 'Binary Search', score: 7, status: 'Stable', metrics: { totalAttempts: 4, solvedCount: 3, successRate: 75, avgTimeTakenMinutes: 22 } },
    { id: 'recursion-backtracking', name: 'Recursion', score: 5, status: 'Needs Revision', metrics: { totalAttempts: 3, solvedCount: 1, successRate: 33, avgTimeTakenMinutes: 35 } },
  ],
  repeatedMistakesLeaderboard: [
    { category: 'Duplicate Handling', count: 2, affectedPatterns: ['two-pointers'] },
    { category: 'Base Case Missing', count: 2, affectedPatterns: ['recursion-backtracking'] },
    { category: 'Off-by-one', count: 1, affectedPatterns: ['binary-search'] },
  ],
}
```

---

## 4. UI Blueprint for Member B (`views/PulseView.jsx`)

1. **Top Row — 4 Metric Cards**:
   - Total Solved (`7 / 12 Problems` with circular mini-progress).
   - Overall Success Rate (`58%`).
   - Practice Streak / Recency (`Active Today` / `0 days since last practice`).
   - Weak Patterns (`2 Topics Require Attention` with amber badge).
2. **Left Column — Weak Patterns Alert**:
   - Amber/Terracotta border card (`border-l-4 border-[#D97757] bg-white p-4 rounded-xl shadow-xs`).
   - Cites actual evidence (*"Recurring 'Duplicate Handling' mistake detected 2 times"*).
   - Root-cause hint badge (*"Prerequisite: Arrays & Hashing is Stable"*).
   - "Solve Targeted Problem" CTA button.
3. **Right Column — Repeated Mistakes Leaderboard**:
   - Clean horizontal bar chart or frequency list:
     - `Duplicate Handling` — 2 occurrences (Affected: `Two Pointers`).
     - `Base Case Missing` — 2 occurrences (Affected: `Recursion`).
4. **Bottom Full-Width — Pattern Mastery Table**:
   - Columns: `Pattern Name`, `Difficulty`, `Attempts`, `Solved`, `Success Rate Bar`, `Mastery Score (0-10)`, `Status Pill`.

---

## 5. What's Next?
As soon as Backend completes **Phase 5 (AI Agent Engine & Recommendation Tool Calling)**, we will publish:
- `f-doc/step-05-agent-revisions.md`: Powering the AI-grounded revision generator and procedural problem-solving checklists!
