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

1. **NEVER TOUCH FRONTEND CODE AT ANY TIME:**
   - The agent / backend engineer must **never create, edit, or delete any files inside `frontend/`**.
   - All frontend code is strictly and exclusively owned by the two frontend team members.
2. **RESTRICTED WORKING DIRECTORIES:**
   - The agent is ONLY permitted to touch:
     - `backend/**` (Backend code, tests, configs)
     - `b-doc/**` (Backend planning and rules)
     - `f-doc/**` (Creating new handoff step docs only)
3. **DO NOT MODIFY EXISTING `f-doc/` FILES:**
   - Once an `f-doc/` step document is created (e.g. `step-01-home-login-shell.md`, `step-02-graph-patterns.md`), **never edit or overwrite it**.
   - If any change is ever needed to an existing file in `f-doc/`, you **MUST ask the user first** and get explicit confirmation before touching it.
4. **INCREMENTAL HANDOFF PROTOCOL:**
   - Every time a backend module is finished:
     - Create a *new* markdown file in `f-doc/` named `step-XX-<module>.md`.
     - Specify whether **Member A** or **Member B** is responsible for wiring it up.
     - Provide exact endpoints, request/response formats, error codes, and copy-pasteable mock JSON.
   - Never dump speculative future tasks that can confuse the frontend team.
