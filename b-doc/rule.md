# Collaboration & Zero-Merge-Conflict Rules (b-doc)

## 1. Team Division & File Isolation

To completely prevent git merge conflicts between the backend and the 2 frontend members:

| Person | Role | Isolated Directories (Only They Edit) |
|---|---|---|
| **Backend (You / Agent)** | Database, Cypher, Express APIs, AI Agent | `backend/**`, `b-doc/**`, `f-doc/**` |
| **Frontend Member A** | Memory Graph Canvas & Inspector Panel | `frontend/src/components/graph/**`<br>`frontend/src/components/inspector/**`<br>`frontend/src/views/GraphView.jsx`<br>`frontend/src/services/api/graphApi.js` |
| **Frontend Member B** | Attempt Logger, Revision Planner & Pulse | `frontend/src/components/attempts/**`<br>`frontend/src/components/revisions/**`<br>`frontend/src/components/pulse/**`<br>`frontend/src/views/PulseView.jsx`<br>`frontend/src/views/PlannerView.jsx`<br>`frontend/src/services/api/attemptsApi.js`<br>`frontend/src/services/api/revisionsApi.js` |
| **Shared Shell (Initial Setup)** | Login & App Layout Shell | `frontend/src/components/layout/**`<br>`frontend/src/views/LoginView.jsx`<br>`frontend/src/index.css`<br>`frontend/src/App.jsx` |

---

## 2. Mandatory Rules for Backend Developers / Agents

1. **Never edit files assigned to Frontend Member A or B directly.**
2. **Every time a backend module is finished:**
   - Create a new markdown file in `f-doc/` named `step-XX-<module>.md`.
   - Specify whether **Member A** or **Member B** is responsible for wiring it up.
   - Provide exact endpoints, request/response formats, error codes, and copy-pasteable mock JSON.
3. **Keep `f-doc/` clean and incremental:**
   - Only document completed backend features or immediately unblocked frontend screens (e.g. Home, Login, App Shell).
   - Never dump speculative future tasks that can confuse the frontend team.
