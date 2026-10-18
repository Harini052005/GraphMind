# GraphMind (RecallGraph AI)

> **Your coding history. Your next breakthrough.**  
> An AI-powered cognitive knowledge graph platform that tracks your LeetCode practice, maps prerequisite dependencies, detects recurring mistake clusters, and generates adaptive procedural revision drills.

---

## 🌟 Key Features

- **Interactive Memory Graph Canvas**: Visualizes DSA patterns as an interactive Directed Acyclic Graph (DAG) with prerequisite lineages, live mastery scores ($0-10$), and real-time status pills (*Stable*, *Needs Revision*, *Critical*).
- **Concept Inspector Panel**: Detailed diagnostic drawer showing pattern metrics, success rate percentages, repeated mistake categories, and prerequisite root-cause hints.
- **Practice Attempt Logger**: Record problem attempts with difficulty, time taken, reflection notes, and code snippets with instant persistence.
- **Pattern Pulse & Learning Analytics**: Deterministic weak pattern scoring, velocity tracking, and mistake clustering leaderboards.
- **AI Agent Revision Planner**: LLM-driven recommendation engine (with deterministic fallback) generating procedural checklists and targeted problem recommendations grounded in verified graph evidence.
- **Resilient Multi-Tier Architecture**: Seamless offline mock fallbacks and local storage synchronization ensuring zero frontend disruption when the database or LLM is offline.

---

## 📊 Graph Data Model

GraphMind models algorithmic learning as a **labeled property graph** in **FalkorDB** (Redis Graph engine). It connects individual practice attempts to underlying abstract patterns, semantic prerequisites, and mistake taxonomies.

### Mermaid Knowledge Graph Diagram

```mermaid
graph TD
    User["(:User {id})"]
    Attempt["(:Attempt {id, result, timeTakenMinutes, notes, codeSnippet})"]
    Problem["(:Problem {id, title, leetcodeUrl, difficulty})"]
    Pattern["(:Pattern {id, name, category, score, difficulty})"]
    Mistake["(:Mistake {category})"]
    Revision["(:Revision {id, reason, recommendation, checklist, status})"]

    User -->|:MADE_ATTEMPT| Attempt
    User -->|:HAS_REVISION| Revision
    Attempt -->|:FOR_PROBLEM| Problem
    Attempt -->|:USES_PATTERN| Pattern
    Attempt -->|:HAD_MISTAKE| Mistake
    Problem -->|:USES_PATTERN| Pattern
    Revision -->|:TARGETS| Pattern
    Pattern -->|:PREREQUISITE_FOR {relation, description}| Pattern
```

---

### Node Definitions

| Node Label | Key Properties | Description |
|---|---|---|
| `(:User)` | `id`, `createdAt` | Tenant isolation boundary (e.g. `demo-user`, `harini-dev`). |
| `(:Pattern)` | `id`, `name`, `category`, `description`, `difficulty`, `recommendedOrder` | The 8 core DSA concepts (e.g. `arrays-hashing`, `two-pointers`, `dynamic-programming`). |
| `(:Problem)` | `id`, `title`, `leetcodeUrl`, `difficulty`, `createdAt` | LeetCode problems attempted (e.g. `3sum`, `valid-palindrome`). |
| `(:Attempt)` | `id`, `result`, `timeTakenMinutes`, `notes`, `codeSnippet`, `createdAt` | Individual practice submission (`Solved`, `Attempted`, or `Failed`). |
| `(:Mistake)` | `category` | Categorized error taxonomy (e.g. `Duplicate Handling`, `Base Case Missing`, `Off-by-one`). |
| `(:Revision)` | `id`, `reason`, `recommendation`, `checklist`, `focusProblem`, `status`, `reflectionNotes` | Targeted procedural repair tasks (`PENDING` or `COMPLETED`). |

---

### Relationship Semantics

| Relationship | Source $\rightarrow$ Target | Semantic Meaning |
|---|---|---|
| `:MADE_ATTEMPT` | `(User) -> (Attempt)` | Records that a user completed a practice session. |
| `:FOR_PROBLEM` | `(Attempt) -> (Problem)` | Identifies the specific LeetCode problem attempted. |
| `:USES_PATTERN` | `(Problem) -> (Pattern)` | Classifies the algorithmic technique required to solve the problem. |
| `:USES_PATTERN` | `(Attempt) -> (Pattern)` | Direct index linking the attempt to its evaluated pattern. |
| `:HAD_MISTAKE` | `(Attempt) -> (Mistake)` | Associates a failed or partial attempt with an identified failure mode. |
| `:PREREQUISITE_FOR` | `(Pattern) -> (Pattern)` | Directed dependency edge expressing conceptual foundations (e.g. *Recursion* $\rightarrow$ *Dynamic Programming*). |
| `:HAS_REVISION` | `(User) -> (Revision)` | Queues an active procedural repair task for the learner. |
| `:TARGETS` | `(Revision) -> (Pattern)` | Binds the revision drill to the weak pattern requiring repair. |

---

### Core Cypher Query Patterns

#### 1. Atomic Attempt Ingestion & Relationship Stitching
```cypher
MERGE (u:User { id: $userId })
MERGE (p:Problem { id: $problemSlug })
  ON CREATE SET p.title = $problemTitle, p.leetcodeUrl = $leetcodeUrl, p.difficulty = $difficulty
MERGE (pt:Pattern { id: $patternId })

CREATE (a:Attempt {
  id: $attemptId,
  result: $result,
  timeTakenMinutes: $timeTakenMinutes,
  notes: $notes,
  codeSnippet: $codeSnippet,
  createdAt: $createdAt
})

CREATE (u)-[:MADE_ATTEMPT]->(a)
CREATE (a)-[:FOR_PROBLEM]->(p)
CREATE (p)-[:USES_PATTERN]->(pt)
CREATE (a)-[:USES_PATTERN]->(pt)

WITH a
CALL {
  WITH a
  WITH a WHERE $mistakeCategory <> '' AND $mistakeCategory IS NOT NULL
  MERGE (m:Mistake { category: $mistakeCategory })
  CREATE (a)-[:HAD_MISTAKE]->(m)
  RETURN count(m) AS mistakeCount
}
RETURN a.id AS id
```

#### 2. Pattern Mastery & Weakness Detection
```cypher
MATCH (u:User { id: $userId })-[:MADE_ATTEMPT]->(a:Attempt)-[:USES_PATTERN]->(pt:Pattern)
OPTIONAL MATCH (a)-[:HAD_MISTAKE]->(m:Mistake)
RETURN 
  pt.id AS patternId,
  count(a) AS totalAttempts,
  sum(CASE WHEN a.result = 'Solved' THEN 1 ELSE 0 END) AS solvedCount,
  sum(CASE WHEN a.result = 'Failed' THEN 1 ELSE 0 END) AS failedCount,
  collect(DISTINCT m.category) AS mistakes
```

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **FalkorDB** *(Optional - automatic in-memory fallback included)*: Local Redis instance with FalkorDB module or [FalkorDB Cloud](https://falkordb.com/) instance.

---

### 1. Clone & Workspace Setup

```bash
git clone https://github.com/Harini052005/GraphMind.git
cd GraphMind
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend/` directory by copying the example:

```bash
cp .env.example .env
```

Edit `backend/.env`:
```ini
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# FalkorDB Connection (Optional: in-memory store activates if unreachable)
FALKORDB_URL=redis://localhost:6379
FALKORDB_GRAPH=leetcode_mastery

# LLM Agent Configuration (Optional: deterministic rule engine activates if unset)
LLM_API_KEY=
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
```

#### Seed Initial Demo Dataset
Populate realistic practice records, mistake clusters, and sample revision tasks:

```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```
> Server runs live on `http://localhost:5000` (`GET http://localhost:5000/api/health`).

---

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
> Vite dev server opens on `http://localhost:5173`.

---

## 🧪 Testing & Verification

### Backend Automated Test Suite
Run Vitest unit and integration tests across patterns, analytics, attempts, and agent tools:

```bash
cd backend
npm test
```
*Expected: 14 passing tests across 5 test suites.*

### Frontend Code Quality & Production Build
Run Oxlint and compile the production bundle:

```bash
cd frontend
npm run lint    # 0 errors, 0 warnings
npm run build   # Compiles client environment in <500ms
```

---

## 📡 REST API Reference

| Endpoint | Method | Header | Description |
|---|---|---|---|
| `/api/health` | `GET` | — | FalkorDB database & LLM engine connection status |
| `/api/patterns` | `GET` | `x-user-id` | Returns the 8 DSA concept nodes & 6 prerequisite edges with mastery scores |
| `/api/attempts` | `POST` | `x-user-id` | Records a new LeetCode practice attempt (atomic Cypher persist) |
| `/api/attempts` | `GET` | `x-user-id` | Filter past attempts (`?patternId=&difficulty=&result=`) |
| `/api/analytics` | `GET` | `x-user-id` | Calculates practice metrics, weak patterns, and mistake leaderboard |
| `/api/agent/recommendation` | `POST` | `x-user-id` | Invokes LLM agent / rule fallback for personalized procedural drills |
| `/api/revisions` | `GET` | `x-user-id` | Retrieves user's pending and completed revision checklists |
| `/api/revisions` | `POST` | `x-user-id` | Queues a targeted revision drill for a specific pattern |
| `/api/revisions/:id` | `PATCH` | `x-user-id` | Marks revision task as completed with user reflection notes |

---

## 🎨 Design System & Palette Tokens

All interface components follow the project's warm, minimal aesthetic:

```css
:root {
  --bg-app: #F5F0E8;        /* Warm Beige / Cream canvas background */
  --bg-card: #FFFFFF;       /* Clean White card surfaces */
  --bg-card-subtle: #FAF7F2;/* Soft cream container background */
  --border-subtle: #E8E2D8; /* Warm light border */
  --text-primary: #1C1C1C;  /* Ink black headings & body */
  --text-secondary: #5C4033;/* Dark Walnut brown secondary text */
  --text-muted: #8C7E72;    /* Muted label captions */
  --color-mint: #98D8B0;    /* Mint green (Primary buttons, stable status) */
  --color-sage: #57B2A0;    /* Soft sage green (Secondary accents) */
  --color-terracotta: #D97757; /* Amber / Terracotta (Critical weak badges) */
}
```

---

## 👥 Contributors & Architecture Separation

- **Member A (Friend 1 / Harini)**: Memory Graph Canvas (`components/graph/**`), Concept Inspector Drawer (`components/inspector/**`), Shared App Shell, and Graph Views.
- **Member B (Friend 2 / Mouni)**: Attempt Logger Modal (`components/attempts/**`), Pattern Pulse Dashboard (`components/pulse/**`), Revision Planner (`components/revisions/**`), and Analytics Views.
- **Backend (Ranjitha)**: FalkorDB Graph Schema, Cypher persistence services, Analytics scoring engine, and AI Agent tool-calling architecture.
