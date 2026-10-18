# Frontend Step 1: Design System, Login & Home Shell

**Current Status**: Backend Phase 1 is LIVE (`http://localhost:5000/api/health`)  
**Assigned To**: Friend 1 (Member A) & Friend 2 (Member B)  
**Goal**: Build the shared application frame, color theme, login/user switcher, and real-time backend connection status.

---

## 1. Design System & Theme Setup
Use the warm, minimal aesthetic from the reference dashboard. Add these tokens to `frontend/src/index.css`:

```css
@import "tailwindcss";

:root {
  --bg-app: #F5F0E8;        /* Warm Beige / Cream background */
  --bg-card: #FFFFFF;       /* Clean White card surfaces */
  --bg-card-subtle: #FAF7F2;/* Soft cream node background */
  --border-subtle: #E8E2D8; /* Warm light border */
  --text-primary: #1C1C1C;  /* Ink black */
  --text-secondary: #5C4033;/* Dark Walnut brown */
  --text-muted: #8C7E72;    /* Muted label brown */
  --color-mint: #98D8B0;    /* Mint green (Primary button & highlights) */
  --color-sage: #57B2A0;    /* Soft sage green (Secondary accents) */
  --color-terracotta: #D97757; /* Amber / Terracotta (Critical badge) */
}

body {
  background-color: var(--bg-app);
  color: var(--text-primary);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
}
```

---

## 2. Team Workload Division (Zero Merge Conflicts)

To prevent git conflicts, work on separate files:

| Member | Specific File to Create | Description |
|---|---|---|
| **Member A (Friend 1)** | `frontend/src/components/layout/Sidebar.jsx` | Left navigation rail with tabs: `Memory Graph`, `Pattern Pulse`, `Revision Planner` |
| **Member A (Friend 1)** | `frontend/src/views/GraphView.jsx` | Placeholder container for the upcoming visual memory graph canvas |
| **Member B (Friend 2)** | `frontend/src/components/layout/Header.jsx` | Top bar with app title, active user profile pill, and live backend connection badge |
| **Member B (Friend 2)** | `frontend/src/views/LoginView.jsx` | Clean, minimalist login modal / screen for entering username and storing `userId` in `localStorage` |

---

## 3. Backend Integration (Already Live!)

### Health Check Endpoint
Call this in `Header.jsx` on mount to show the backend connectivity status:
- **URL**: `http://localhost:5000/api/health`
- **Method**: `GET`
- **Response Format**:
```json
{
  "status": "ok",
  "falkordb": {
    "connected": true,
    "graph": "leetcode_mastery"
  },
  "llm": {
    "configured": true,
    "fallbackMode": "ready"
  }
}
```

### UI Behavior:
- When `status === 'ok'`, display a soft green badge: `● Backend Connected`.
- If server is unreachable or `status === 'degraded'`, display an amber badge: `▲ Offline / Degraded Mode`.

---

## 4. Shared API Client (`frontend/src/services/api/client.js`)

Create this utility so all future requests automatically send the active `userId`:

```javascript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function getActiveUserId() {
  return localStorage.getItem('recallgraph_user_id') || 'demo-user'
}

export function setActiveUserId(userId) {
  localStorage.setItem('recallgraph_user_id', userId)
}

export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, headers = {} } = options
  const userId = getActiveUserId()

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data?.error?.message || `Request failed (${response.status})`)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}
```

---

## 5. Main App Assembly (`frontend/src/App.jsx`)

`App.jsx` handles tab navigation and renders the layout:

```jsx
import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import LoginView from './views/LoginView'
import GraphView from './views/GraphView'

export default function App() {
  const [activeTab, setActiveTab] = useState('graph') // 'graph' | 'pulse' | 'planner'
  const [user, setUser] = useState(() => localStorage.getItem('recallgraph_user_id') || 'demo-user')
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F0E8] text-[#1C1C1C]">
      {/* Left Navigation Rail (Built by Member A) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Header (Built by Member B) */}
        <Header user={user} onOpenLogin={() => setShowLogin(true)} />

        {/* Tab View Container */}
        <main className="flex-1 overflow-auto p-4">
          {activeTab === 'graph' && <GraphView />}
          {activeTab === 'pulse' && <div className="p-8 text-[#5C4033]">Pattern Pulse View (Coming in Step 4)</div>}
          {activeTab === 'planner' && <div className="p-8 text-[#5C4033]">Revision Planner View (Coming in Step 5)</div>}
        </main>
      </div>

      {/* User Switcher / Login Modal (Built by Member B) */}
      {showLogin && <LoginView currentUser={user} onSelectUser={(newUser) => { setUser(newUser); setShowLogin(false); }} onClose={() => setShowLogin(false)} />}
    </div>
  )
}
```

---

## 6. What's Next?
As soon as Backend completes **Phase 2 (Graph Schema & Patterns)**, we will publish:
- `f-doc/step-02-graph-patterns.md`: Providing the graph node dataset, prerequisite edges, and Cypher query results for **Member A** to populate the interactive Memory Graph Canvas!
