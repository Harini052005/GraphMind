# Frontend Step 3: Attempt Logger Modal & Practice History

**Current Status**: Backend Phase 3 is LIVE (`POST /api/attempts` & `GET /api/attempts`)  
**Assigned To**: **Friend 2 (Member B)**  
**Target Components**:
1. `frontend/src/services/api/attemptsApi.js`
2. `frontend/src/components/attempts/LogAttemptModal.jsx`
3. `frontend/src/components/attempts/AttemptHistoryList.jsx`

---

## 1. Backend Endpoint Specifications

### A. Record an Attempt
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/attempts`
- **Headers**:
  ```http
  Content-Type: application/json
  x-user-id: demo-user
  ```
- **Request Body JSON**:
```json
{
  "problemTitle": "3Sum",
  "leetcodeUrl": "https://leetcode.com/problems/3sum/",
  "difficulty": "Medium",
  "patternId": "two-pointers",
  "result": "Failed",
  "timeTakenMinutes": 35,
  "mistakeCategory": "Duplicate Handling",
  "notes": "Forgot to increment left pointer while nums[left] === nums[left+1].",
  "codeSnippet": "while (left < right && nums[left] === nums[left + 1]) left++;"
}
```

#### Field Rules & Validation:
| Field | Type | Required | Allowed Values / Constraints |
|---|---|---|---|
| `problemTitle` | string | **Yes** | Min 2, max 200 characters |
| `leetcodeUrl` | string | No | Valid URL format or empty string |
| `difficulty` | enum | **Yes** | `"Easy"`, `"Medium"`, `"Hard"` |
| `patternId` | enum | **Yes** | `"arrays-hashing"`, `"two-pointers"`, `"sliding-window"`, `"binary-search"`, `"recursion-backtracking"`, `"tree-traversal"`, `"graph-algorithms"`, `"dynamic-programming"` |
| `result` | enum | **Yes** | `"Solved"`, `"Attempted"`, `"Failed"` |
| `timeTakenMinutes` | integer | **Yes** | 1 to 300 minutes |
| `mistakeCategory` | string | No | Common categories: `"Duplicate Handling"`, `"Off-by-one"`, `"Base Case Missing"`, `"Pointer Bounds"`, `"State Transition"`, `"Time Limit Exceeded"`, or custom text |
| `notes` | string | No | Optional reflection notes (max 3000 chars) |
| `codeSnippet` | string | No | Optional code snippet (max 15000 chars) |

#### Response Example (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "att_1792310758610_aak7xs",
    "problemTitle": "3Sum",
    "difficulty": "Medium",
    "patternId": "two-pointers",
    "result": "Failed",
    "timeTakenMinutes": 35,
    "mistakeCategory": "Duplicate Handling",
    "notes": "Forgot to increment left pointer...",
    "createdAt": "2026-10-18T08:05:58.610Z"
  },
  "message": "Attempt successfully recorded in persistent graph memory"
}
```

---

### B. Retrieve User's Past Attempts
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/attempts`
- **Optional Query Params**: `?patternId=two-pointers&difficulty=Medium&result=Failed&limit=50`
- **Headers**: `x-user-id: demo-user`
- **Response Example (`200 OK`)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "att_1792310758610_aak7xs",
      "problemTitle": "3Sum",
      "leetcodeUrl": "https://leetcode.com/problems/3sum/",
      "difficulty": "Medium",
      "patternId": "two-pointers",
      "result": "Failed",
      "timeTakenMinutes": 35,
      "mistakeCategory": "Duplicate Handling",
      "notes": "Forgot to increment left pointer...",
      "createdAt": "2026-10-18T08:05:58.610Z"
    }
  ]
}
```

---

## 2. Copy-Pasteable Frontend Service (`frontend/src/services/api/attemptsApi.js`)

```javascript
import { apiRequest } from './client'

export async function recordAttempt(payload) {
  return await apiRequest('/api/attempts', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchUserAttempts(filters = {}) {
  const query = new URLSearchParams()
  if (filters.patternId) query.set('patternId', filters.patternId)
  if (filters.difficulty) query.set('difficulty', filters.difficulty)
  if (filters.result) query.set('result', filters.result)

  const queryString = query.toString() ? `?${query.toString()}` : ''
  const response = await apiRequest(`/api/attempts${queryString}`)
  return response.data || []
}
```

---

## 3. UI Component Blueprint for Member B

### A. Modal Dialog (`components/attempts/LogAttemptModal.jsx`)
- **Header**: `Log Practice Attempt` with an `✕` close button.
- **Problem Title & URL**: Text inputs with clean beige/white styling (`border border-[#E8E2D8] rounded-lg p-2.5 bg-white text-[#1C1C1C]`).
- **Difficulty Pills**: 3 selectable buttons (`Easy` [emerald], `Medium` [amber], `Hard` [rose]).
- **Pattern Selector**: Dropdown showing the 8 standard DSA patterns.
- **Result Selector**: 3 state buttons:
  - `Solved` (Mint green highlight)
  - `Attempted` (Soft blue highlight)
  - `Failed` (Warm terracotta highlight)
- **Time Taken**: Number input with a "+5m / +15m" quick-add button.
- **Mistake Category** *(Visible only if Result is "Failed" or "Attempted")*:
  - Predefined chips: `Off-by-one`, `Duplicate Handling`, `Base Case Missing`, `Pointer Bounds`, `Time Limit`, or Custom.
- **Notes & Code Snippet**: Expandable text areas with monospace font for code.
- **Submit Button**: Mint green pill button (`bg-[#98D8B0] hover:bg-[#85c99e] text-[#123824] font-medium py-2 px-5 rounded-lg`).
- **Feedback**: Displays success toast and triggers an `onSuccess()` callback to refresh graph & history!

---

## 4. What's Next?
As soon as Backend completes **Phase 4 (Deterministic Analytics & Weak Pattern Scorer)**, we will publish:
- `f-doc/step-04-analytics.md`: Powering the **Pattern Pulse** leaderboard and mistake clustering views for Member B!
