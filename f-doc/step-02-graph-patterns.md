# Frontend Step 2: Interactive Memory Graph & Concept Inspector

**Current Status**: Backend Phase 2 is LIVE (`GET /api/patterns`)  
**Assigned To**: **Friend 1 (Member A)**  
**Target Components**:
1. `frontend/src/services/api/graphApi.js`
2. `frontend/src/components/graph/MemoryGraphCanvas.jsx`
3. `frontend/src/components/inspector/ConceptInspector.jsx`
4. `frontend/src/views/GraphView.jsx` (assembly)

---

## 1. Backend Endpoint Details
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/patterns`
- **Headers**:
  ```http
  x-user-id: demo-user
  ```
- **Description**: Returns all 8 semantic DSA concept nodes (with status, mastery score 0–10, attempts, and repeated mistakes) and 6 prerequisite dependency connector edges.

---

## 2. API Response JSON Structure

```json
{
  "summary": {
    "totalConcepts": 8,
    "totalDependencies": 6,
    "stableCount": 3,
    "needsRevisionCount": 2,
    "unpracticedCount": 3,
    "dataSource": "falkordb-cloud"
  },
  "nodes": [
    {
      "id": "recursion-backtracking",
      "name": "Recursion & Backtracking",
      "category": "State Space Search",
      "description": "Call-stack state exploration, decision trees, and pruning.",
      "difficulty": "Medium-Hard",
      "recommendedOrder": 5,
      "score": 6,
      "status": "Needs Revision",
      "metrics": {
        "totalAttempts": 4,
        "solvedCount": 2,
        "failedCount": 1,
        "attemptedCount": 1,
        "successRate": 50,
        "misconceptionClusters": 1,
        "repeatedMistakes": [
          { "category": "Base Case Missing", "count": 2 }
        ]
      }
    }
  ],
  "edges": [
    {
      "from": "recursion-backtracking",
      "to": "tree-traversal",
      "relation": "structural_basis",
      "description": "Call stack recursion mirrors tree hierarchy traversal"
    },
    {
      "from": "recursion-backtracking",
      "to": "dynamic-programming",
      "relation": "recurrence_thinking",
      "description": "Dynamic programming memoizes repeated recursive subproblems"
    }
  ]
}
```

---

## 3. Copy-Pasteable Frontend Service (`frontend/src/services/api/graphApi.js`)

Create this file to fetch live data (with automatic mock fallback):

```javascript
import { apiRequest } from './client'

export async function fetchPatternsGraph() {
  try {
    return await apiRequest('/api/patterns')
  } catch (error) {
    console.warn('Backend unavailable, using initial mock data', error)
    return MOCK_GRAPH_DATA
  }
}

export const MOCK_GRAPH_DATA = {
  summary: { totalConcepts: 8, totalDependencies: 6, stableCount: 3, needsRevisionCount: 2, unpracticedCount: 3 },
  nodes: [
    { id: 'arrays-hashing', name: 'Arrays & Hashing', score: 8, status: 'Stable', metrics: { totalAttempts: 6, solvedCount: 5, failedCount: 0, attemptedCount: 1, successRate: 83, misconceptionClusters: 0, repeatedMistakes: [] } },
    { id: 'two-pointers', name: 'Two Pointers', score: 4, status: 'Needs Revision', metrics: { totalAttempts: 5, solvedCount: 2, failedCount: 3, attemptedCount: 0, successRate: 40, misconceptionClusters: 1, repeatedMistakes: [{ category: 'Duplicate Handling', count: 2 }] } },
    { id: 'sliding-window', name: 'Sliding Window', score: 0, status: 'Unpracticed', metrics: { totalAttempts: 0, solvedCount: 0, failedCount: 0, attemptedCount: 0, successRate: 0, misconceptionClusters: 0, repeatedMistakes: [] } },
    { id: 'binary-search', name: 'Binary Search', score: 7, status: 'Stable', metrics: { totalAttempts: 4, solvedCount: 3, failedCount: 0, attemptedCount: 1, successRate: 75, misconceptionClusters: 0, repeatedMistakes: [] } },
    { id: 'recursion-backtracking', name: 'Recursion', score: 6, status: 'Needs Revision', metrics: { totalAttempts: 4, solvedCount: 2, failedCount: 2, attemptedCount: 0, successRate: 50, misconceptionClusters: 1, repeatedMistakes: [{ category: 'Base Case Missing', count: 2 }] } },
    { id: 'tree-traversal', name: 'Tree Traversal', score: 0, status: 'Unpracticed', metrics: { totalAttempts: 0, solvedCount: 0, failedCount: 0, attemptedCount: 0, successRate: 0, misconceptionClusters: 0, repeatedMistakes: [] } },
    { id: 'graph-algorithms', name: 'Graphs', score: 0, status: 'Unpracticed', metrics: { totalAttempts: 0, solvedCount: 0, failedCount: 0, attemptedCount: 0, successRate: 0, misconceptionClusters: 0, repeatedMistakes: [] } },
    { id: 'dynamic-programming', name: 'Dynamic Programming', score: 2, status: 'Critical', metrics: { totalAttempts: 3, solvedCount: 0, failedCount: 3, attemptedCount: 0, successRate: 0, misconceptionClusters: 1, repeatedMistakes: [{ category: 'State Transition', count: 2 }] } },
  ],
  edges: [
    { from: 'arrays-hashing', to: 'two-pointers', relation: 'prerequisite' },
    { from: 'two-pointers', to: 'sliding-window', relation: 'extends' },
    { from: 'arrays-hashing', to: 'binary-search', relation: 'prerequisite' },
    { from: 'recursion-backtracking', to: 'tree-traversal', relation: 'recursive pattern' },
    { from: 'tree-traversal', to: 'graph-algorithms', relation: 'generalization' },
    { from: 'recursion-backtracking', to: 'dynamic-programming', relation: 'recurrence thinking' },
  ],
}
```

---

## 4. UI Implementation Blueprint (Reference Dashboard)

### A. Central Memory Graph Canvas (`MemoryGraphCanvas.jsx`)
- Render nodes as clean white cards (`bg-white border border-[#E8E2D8] rounded-xl p-3 shadow-xs`).
- **Node Anatomy**:
  - Concept Name (`text-sm font-semibold text-[#1C1C1C]`).
  - Status Indicator dot:
    - `Stable` $\rightarrow$ Soft green (`bg-[#98D8B0] text-[#1D4A38]`).
    - `Needs Revision` $\rightarrow$ Amber / Terracotta (`bg-[#FCE8E1] text-[#D97757]`).
    - `Unpracticed` $\rightarrow$ Soft gray (`bg-[#E8E2D8] text-[#7A6F64]`).
  - Score Badge in top-right corner of card (`bg-[#1C1C1C] text-white text-xs px-2 py-0.5 rounded`).
  - Attempts count subtitle (`X affected / Y attempts`).
- **Curved Connectors**:
  - Draw SVG `<path d="M x1 y1 C ... x2 y2" stroke="#B8AEA2" strokeDasharray="4" fill="none" />`.
  - Add small relationship label badge centered on the curve (e.g. `prerequisite`, `recurrence thinking`).
- **Interaction**:
  - Clicking any node calls `onSelectNode(node)` to highlight it and populate the right-side inspector!

### B. Right Concept Inspector (`ConceptInspector.jsx`)
- Matches the right panel in the reference screenshot:
  1. **Selected Concept Header**: Name, Status pill, and big dark Score badge (`6 SCORE`).
  2. **Score Breakdown Card**:
     - Total Attempts, Success Rate %, Misconception clusters count.
  3. **Misconceptions & Repeated Mistakes**:
     - Lists repeated mistake categories (e.g. `Base Case Missing (2 times)`).
  4. **Root Cause Analysis Breadcrumb**:
     - Shows incoming prerequisite edges (e.g. *“Recursion is a prerequisite for Dynamic Programming and appears in the confusion trail”*).
  5. **Action Button**:
     - Mint green button: `+ Request AI Revision Task` (will trigger agent in Step 5).

---

## 5. View Assembly (`frontend/src/views/GraphView.jsx`)

```jsx
import { useState, useEffect } from 'react'
import { fetchPatternsGraph } from '../services/api/graphApi'
import MemoryGraphCanvas from '../components/graph/MemoryGraphCanvas'
import ConceptInspector from '../components/inspector/ConceptInspector'

export default function GraphView() {
  const [data, setData] = useState(null)
  const [selectedNodeId, setSelectedNodeId] = useState('recursion-backtracking')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatternsGraph().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  if (loading || !data) return <div className="p-8 text-[#5C4033]">Loading Memory Graph...</div>

  const selectedNode = data.nodes.find((n) => n.id === selectedNodeId) || data.nodes[0]

  return (
    <div className="flex h-full w-full gap-4">
      {/* Visual Canvas (takes remaining width) */}
      <div className="flex-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl relative overflow-hidden">
        <MemoryGraphCanvas
          nodes={data.nodes}
          edges={data.edges}
          selectedId={selectedNodeId}
          onSelect={(id) => setSelectedNodeId(id)}
        />
      </div>

      {/* Right Inspector Panel (fixed width ~340px) */}
      <div className="w-88 shrink-0">
        <ConceptInspector node={selectedNode} allEdges={data.edges} allNodes={data.nodes} />
      </div>
    </div>
  )
}
```

---

## 6. What's Next?
As soon as Backend completes **Phase 3 (Attempt Recording API)**, we will publish:
- `f-doc/step-03-attempts.md`: Enabling **Friend 2 (Member B)** to wire up the Attempt Recording Form and persist live LeetCode attempts!
