# Frontend Architecture & Collaboration Rules (`f-rules.md`)

> **MANDATORY DIRECTIVE**: All frontend developers, contributors, and AI pair-programming agents must strictly comply with the rules outlined in this document. Under no circumstances should any rule be bypassed.

---

## 1. Absolute Backend Isolation (Zero Backend Touching)

1. **Never Touch Backend Code**:
   - You must **NEVER** edit, create, delete, or rename any file in `backend/**` or `b-doc/**`.
   - Frontend tasks must have **zero side-effects** on backend files, configurations, migrations, database scripts, or backend documentation.
2. **Strict API Contract Consumption**:
   - The frontend communicates with the backend exclusively via HTTP REST endpoints documented in `f-doc/step-*.md`.
   - Base URL configuration is handled in `frontend/src/services/api/client.js` via `import.meta.env.VITE_API_URL || 'http://localhost:5000'`.
3. **Resilience & Mocking**:
   - If a backend endpoint is not yet live or in progress, use isolated client-side mock adapters inside `frontend/src/services/api/mocks/` or default state in UI components.
   - **Never modify backend route handlers or server files to simulate frontend test data.**

---

## 2. Strict Design System & Color Palette

All styling must strictly adhere to the warm, minimalist aesthetic defined in `frontend/src/index.css`. Random or generic colors (plain blue, red, purple, neon) are strictly prohibited.

### Design Tokens

| Token Variable | Hex Code | Role / Usage |
|---|---|---|
| `--bg-app` | `#F5F0E8` | Warm Beige / Cream canvas background |
| `--bg-card` | `#FFFFFF` | Clean White card surfaces & modal backgrounds |
| `--bg-card-subtle` | `#FAF7F2` | Soft cream node background, hover states, secondary surface |
| `--border-subtle` | `#E8E2D8` | Warm light borders, dividers, card outlines |
| `--text-primary` | `#1C1C1C` | Ink black for headings, primary text, active labels |
| `--text-secondary` | `#5C4033` | Dark Walnut brown for subtitles, descriptions, icons |
| `--text-muted` | `#8C7E72` | Muted brown for timestamps, meta labels, placeholders |
| `--color-mint` | `#98D8B0` | Mint green for primary buttons, active highlights, success badges |
| `--color-sage` | `#57B2A0` | Soft sage green for secondary accents, connected indicator |
| `--color-terracotta` | `#D97757` | Amber / Terracotta for warnings, mistakes, critical badges |

### Tailwind Palette Reference
When writing Tailwind utility classes or custom arbitrary values, always use these exact hex values:
- Backgrounds: `bg-[#F5F0E8]`, `bg-white`, `bg-[#FAF7F2]`
- Borders: `border-[#E8E2D8]`
- Text: `text-[#1C1C1C]`, `text-[#5C4033]`, `text-[#8C7E72]`
- Accents: `bg-[#98D8B0]`, `text-[#57B2A0]`, `bg-[#D97757]`

---

## 3. Reusable Code & Zero Duplication (DRY Principle)

1. **Extract Shared UI Elements**:
   - Never duplicate buttons, cards, badges, inputs, or modal wrappers across views.
   - All shared primitives live in `frontend/src/components/ui/`:
     - `Button.jsx`: Supports variants (`primary`, `secondary`, `outline`, `ghost`, `danger`).
     - `Card.jsx`: Reusable container with `--bg-card` and `--border-subtle`.
     - `Badge.jsx`: Standardized status pills (e.g. `mint` for success, `terracotta` for weak/critical, `sage` for active).
     - `Modal.jsx`: Unified dialog wrapper with backdrop and escape/close triggers.
     - `Input.jsx` / `Select.jsx`: Consistent text inputs and dropdowns.
     - `StatusIndicator.jsx`: Pulsing status pill for backend health.
2. **Centralized API Client**:
   - **Never** write raw `fetch()` or `axios` calls directly inside view or layout components.
   - All requests must go through `frontend/src/services/api/client.js` using `apiRequest(endpoint, options)`.
   - Domain-specific API services must be isolated (e.g., `graphApi.js`, `attemptsApi.js`, `revisionsApi.js`).
3. **Custom Hooks for Shared State**:
   - Extract repeated logic into `frontend/src/hooks/` (e.g., `useBackendHealth`, `useLocalStorage`, `useActiveUser`).

---

## 4. Mandatory Tailwind CSS Standards

1. **Tailwind First**:
   - Build all layout, typography, flexbox/grid, spacing, and responsive behaviors using Tailwind CSS.
   - **No inline styles (`style={{ ... }}`)** except for dynamic runtime values (e.g., dynamic SVG paths, canvas zoom/pan transforms, or graph coordinate rendering).
2. **Micro-Interactions & States**:
   - Provide visual feedback for all interactive elements:
     - Hover states: `hover:opacity-90`, `hover:bg-[#FAF7F2]`, `hover:border-[#57B2A0]`.
     - Active states: `active:scale-[0.98]`.
     - Transitions: `transition-all duration-200 ease-in-out`.
     - Focus rings: `focus:outline-none focus:ring-2 focus:ring-[#98D8B0]`.
3. **Responsive & Fluid Layouts**:
   - Use mobile-first Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`).
   - Ensure clean scroll behavior: `overflow-hidden` for root app shell, `overflow-y-auto` for scrollable panes.

---

## 5. Scalable Frontend Architecture

To ensure the frontend scales smoothly as new features are added, adhere to this directory structure:

```
frontend/src/
├── assets/                  # Static assets (logos, SVGs, icons)
├── components/
│   ├── ui/                  # Atomic reusable components (Button, Card, Badge, Modal, Input)
│   ├── layout/              # App shell frames (Header, Sidebar, Navigation)
│   ├── graph/               # Interactive Memory Graph Canvas (Member A)
│   ├── inspector/           # Graph Node / Pattern Inspector panel (Member A)
│   ├── attempts/            # Problem Attempt logger & dialogs (Member B)
│   ├── pulse/               # Pattern Pulse analytics widgets (Member B)
│   └── revisions/           # Revision Planner checklists & tasks (Member B)
├── hooks/                   # Reusable custom React hooks
├── services/
│   └── api/                 # API client & domain-specific service files
│       ├── client.js        # Core fetch client with auth & base URL
│       ├── graphApi.js      # Graph schema & node queries
│       ├── attemptsApi.js   # Problem attempt recording & history
│       └── revisionsApi.js  # Revision tasks & checklists
├── views/                   # Full-page / tab-level views (GraphView, PulseView, PlannerView, LoginView)
├── utils/                   # Pure helper functions, date formatters, math utilities
├── App.jsx                  # Main application orchestrator & shell
├── index.css                # CSS variables & Tailwind @import
└── main.jsx                 # Vite React entry point
```

### Team Division & Zero Merge Conflicts

| Contributor | Isolated Work Areas |
|---|---|
| **Member A (Friend 1)** | `frontend/src/components/graph/**`<br>`frontend/src/components/inspector/**`<br>`frontend/src/views/GraphView.jsx`<br>`frontend/src/services/api/graphApi.js` |
| **Member B (Friend 2)** | `frontend/src/components/attempts/**`<br>`frontend/src/components/revisions/**`<br>`frontend/src/components/pulse/**`<br>`frontend/src/views/PulseView.jsx`<br>`frontend/src/views/PlannerView.jsx`<br>`frontend/src/services/api/attemptsApi.js`<br>`frontend/src/services/api/revisionsApi.js` |
| **Shared Shell** | `frontend/src/components/layout/**`<br>`frontend/src/components/ui/**`<br>`frontend/src/views/LoginView.jsx`<br>`frontend/src/index.css`<br>`frontend/src/App.jsx` |

---

## 6. Pre-Commit Verification Checklist

Before opening a PR, committing code, or completing an AI task, verify all items:

- [ ] **Backend Unchanged**: Are all files in `backend/**` and `b-doc/**` completely untouched?
- [ ] **Color Tokens Respected**: Are only official warm minimal palette colors used (`#F5F0E8`, `#FFFFFF`, `#FAF7F2`, `#E8E2D8`, `#1C1C1C`, `#5C4033`, `#8C7E72`, `#98D8B0`, `#57B2A0`, `#D97757`)?
- [ ] **Zero Code Duplication**: Have repeated UI elements been factored into `components/ui/`?
- [ ] **Centralized API**: Are all API calls using `frontend/src/services/api/client.js` with `apiRequest()`?
- [ ] **Tailwind Compliant**: Is all styling powered by Tailwind CSS classes without arbitrary inline styles?
- [ ] **File Isolation Respected**: Did Member A or B remain strictly inside their assigned domain directories?
- [ ] **Scalable & Modular**: Are components kept focused, readable, and properly exported?
