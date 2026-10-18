# Backend Implementation Plan (b-doc)

## 1. Backend Architecture

```
backend/
├── src/
│   ├── config/          # Environment & constants (PORT, FALKORDB_URL, LLM)
│   ├── graph/           # FalkorDB client, schema indexes, seed, Cypher queries
│   ├── services/        # Analytics engine, attempt tracking, revision logic
│   ├── agent/           # Tool definitions, prompt builder, LLM client, fallback
│   ├── controllers/     # HTTP route handlers
│   ├── routes/          # Express route definitions
│   ├── validation/      # Zod request/response validation schemas
│   └── server.js        # Express app entrypoint & health checks
├── tests/               # Vitest unit & integration test suite
├── .env.example
├── .env
└── package.json
```

---

## 2. Mandatory Frontend Handoff Rule

> **CRITICAL RULE**: Whenever ANY backend module or endpoint is completed:
> 1. You MUST immediately write the corresponding next step in `f-doc/` (e.g. `step-02-graph-patterns.md`, `step-03-attempts.md`).
> 2. The document must give the frontend team exact endpoint paths, request/response JSON schemas, copy-pasteable mock data, and specify which friend (Member A or B) should implement it.
> 3. Never dump unfinished future frontend tasks in `f-doc`. Only add the immediate next actionable step.

---

## 3. Backend Execution Roadmap

### Phase 1: Environment & Server Core (COMPLETED ✅)
- Express server, CORS (`http://localhost:5173`), JSON parser.
- FalkorDB connection client (`backend/src/graph/client.js`) with connection verification and graceful teardown.
- `GET /api/health` endpoint responding with FalkorDB status and LLM fallback state.
- Centralized configuration in `backend/src/config/index.js`.

### Phase 2: FalkorDB Cloud Schema & Semantic Pattern Seeding (COMPLETED ✅)
- Schema indexes and uniqueness constraints (`:User(id)`, `:Problem(id)`, `:Pattern(id)`, `:Pattern(name)`, `:Mistake(category)`).
- Semantic DSA Knowledge Graph seeding (8 patterns + 6 prerequisite dependency edges: `Recursion` $\rightarrow$ `Tree Traversal` $\rightarrow$ `DP`).
- Offline in-memory fallback adapter (`backend/src/graph/store.js`) ensuring seamless operation with or without live cloud database.
- `GET /api/patterns` endpoint verified and tested with Vitest.
- **Handoff**: Created `f-doc/step-02-graph-patterns.md` for Member A.

### Phase 3: Attempt Recording & Cypher Persistence (COMPLETED ✅)
- Parameterized Cypher query to atomically record problem attempts:
  - Create/merge `(:User)`, `(:Problem)`, `(:Pattern)`, `(:Mistake)`.
  - Link `(User)-[:MADE_ATTEMPT]->(Attempt)-[:FOR_PROBLEM]->(Problem)`.
  - Link `(Attempt)-[:USES_PATTERN]->(Pattern)` and optional `(Attempt)-[:HAD_MISTAKE]->(Mistake)`.
- Zod validation for attempt submissions with strict boundary checks.
- Implemented `POST /api/attempts` and `GET /api/attempts` with tenant isolation.
- Verified with 7 passing Vitest tests and live HTTP execution.
- **Handoff**: Created `f-doc/step-03-attempts.md` for Member B.

### Phase 4: Deterministic Analytics & Weak Pattern Scorer (COMPLETED ✅)
- Multi-dimensional transparent scoring formula (Success Rate $< 50\%$, repeated mistakes $\ge 2$, recency decay $> 7$ days).
- Implemented insufficient-evidence safeguard (single failure never prematurely labeled Critical).
- Root-cause dependency candidate analysis powered by prerequisite graph edges.
- `GET /api/analytics` endpoint verified and tested with 10 total passing Vitest tests.
- **Handoff**: Created `f-doc/step-04-analytics.md` for Member B (Mouni).

### Phase 5: AI Agent Engine with Graph Tool Calling (COMPLETED ✅)
- Graph Tools: `getUserHistory`, `getPatternStats`, `getRepeatedMistakes`, `createRevisionTask`.
- Strict Zod schema validation ensuring grounded evidence and no hallucinations.
- Resilient deterministic fallback engine when `LLM_API_KEY` is not provided or offline.
- `POST /api/agent/recommendation` endpoint mounted and verified.

### Phase 6: Revision System & Procedural Checklists (COMPLETED ✅)
- Graph schema linking `(User)-[:HAS_REVISION]->(Revision)-[:TARGETS]->(Pattern)`.
- Actionable procedural memory checklists tailored per DSA pattern and recurring mistake.
- Revision task lifecycle (`PENDING` $\rightarrow$ `COMPLETED` with user reflection notes).
- `GET /api/revisions`, `POST /api/revisions`, `PATCH /api/revisions/:id` endpoints mounted and verified.
- 14 total passing Vitest unit & integration tests.
- **Handoff**: Created `f-doc/step-05-agent-revisions.md` for Member B (Mouni).

### Phase 7: Automated Tests & Demo Seeding (COMPLETED ✅)
- Realistic seed script (`backend/src/graph/seed.js` / `npm run seed`) generating 13 attempts, weak patterns, repeated mistakes, and revision tasks.
- Complete Vitest test suite with 14 passing unit and integration tests.
- Full end-to-end API verification on live endpoints.
- **Handoff**: Created `f-doc/step-06-demo-seed-and-testing.md` for Harini & Mouni.

