import { executeQuery, checkFalkorHealth } from '../graph/client.js'
import { inMemoryStore } from '../graph/store.js'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

/**
 * Normalizes pattern names/ids into canonical pattern IDs
 */
function normalizePatternId(raw) {
  const s = raw.toLowerCase().replace(/[\s&()\/]+/g, '-')
  if (s.includes('pointer')) return 'two-pointers'
  if (s.includes('sliding')) return 'sliding-window'
  if (s.includes('binary')) return 'binary-search'
  if (s.includes('recursion') || s.includes('backtrack')) return 'recursion-backtracking'
  if (s.includes('tree') || s.includes('dfs') || s.includes('bfs')) return 'tree-traversal'
  if (s.includes('graph')) return 'graph-algorithms'
  if (s.includes('dynamic') || s.includes('dp')) return 'dynamic-programming'
  if (s.includes('array') || s.includes('hash')) return 'arrays-hashing'
  return raw
}

/**
 * Records a problem practice attempt in the persistent graph memory.
 * 
 * @param {string} userId - User identifier (tenant isolation)
 * @param {object} payload - Validated attempt submission data
 */
export async function recordAttemptService(userId = 'demo-user', payload) {
  const health = await checkFalkorHealth()
  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  const problemSlug = slugify(payload.problemTitle)
  const canonicalPatternId = normalizePatternId(payload.patternId)
  const createdAt = new Date().toISOString()

  const record = {
    id: attemptId,
    userId,
    problemSlug,
    problemTitle: payload.problemTitle,
    leetcodeUrl: payload.leetcodeUrl || '',
    difficulty: payload.difficulty,
    patternId: canonicalPatternId,
    result: payload.result,
    timeTakenMinutes: payload.timeTakenMinutes,
    mistakeCategory: payload.mistakeCategory?.trim() || null,
    notes: payload.notes?.trim() || '',
    codeSnippet: payload.codeSnippet || '',
    createdAt,
  }

  if (health.connected) {
    try {
      // Parameterized Cypher query with atomic MERGE and relationship writes
      const cypher = `
        MERGE (u:User { id: $userId })
        ON CREATE SET u.createdAt = datetime()

        MERGE (p:Problem { id: $problemSlug })
        ON CREATE SET p.title = $problemTitle,
                      p.leetcodeUrl = $leetcodeUrl,
                      p.difficulty = $difficulty,
                      p.createdAt = datetime()

        MERGE (pt:Pattern { id: $patternId })

        CREATE (a:Attempt {
          id: $attemptId,
          result: $result,
          timeTakenMinutes: $timeTakenMinutes,
          notes: $notes,
          codeSnippet: $codeSnippet,
          createdAt: datetime()
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
      `

      await executeQuery(cypher, {
        userId,
        problemSlug,
        problemTitle: payload.problemTitle,
        leetcodeUrl: payload.leetcodeUrl || '',
        difficulty: payload.difficulty,
        patternId: canonicalPatternId,
        attemptId,
        result: payload.result,
        timeTakenMinutes: payload.timeTakenMinutes,
        notes: payload.notes || '',
        codeSnippet: payload.codeSnippet || '',
        mistakeCategory: payload.mistakeCategory?.trim() || '',
      })

      // Also mirror in in-memory store for instant cache retrieval
      inMemoryStore.recordAttempt(record)
      return { ...record, storage: 'falkordb-cloud' }
    } catch (err) {
      console.warn(`[AttemptService] Cypher insert warning: ${err.message}. Persisting to in-memory store.`)
      const saved = inMemoryStore.recordAttempt(record)
      return { ...saved, storage: 'in-memory-fallback' }
    }
  } else {
    // Offline mode
    const saved = inMemoryStore.recordAttempt(record)
    return { ...saved, storage: 'in-memory-fallback' }
  }
}

/**
 * Retrieves past problem attempts for a user with optional filters.
 * 
 * @param {string} userId - User identifier
 * @param {object} filters - { patternId, difficulty, result, limit }
 */
export async function getUserAttemptsService(userId = 'demo-user', filters = {}) {
  const health = await checkFalkorHealth()

  if (health.connected) {
    try {
      const cypher = `
        MATCH (u:User { id: $userId })-[:MADE_ATTEMPT]->(a:Attempt)-[:FOR_PROBLEM]->(p:Problem)
        MATCH (a)-[:USES_PATTERN]->(pt:Pattern)
        OPTIONAL MATCH (a)-[:HAD_MISTAKE]->(m:Mistake)
        RETURN a.id AS id,
               p.title AS problemTitle,
               p.leetcodeUrl AS leetcodeUrl,
               p.difficulty AS difficulty,
               pt.id AS patternId,
               pt.name AS patternName,
               a.result AS result,
               a.timeTakenMinutes AS timeTakenMinutes,
               m.category AS mistakeCategory,
               a.notes AS notes,
               a.codeSnippet AS codeSnippet,
               a.createdAt AS createdAt
        ORDER BY a.createdAt DESC
        LIMIT $limit
      `

      const result = await executeQuery(cypher, {
        userId,
        limit: filters.limit || 50,
      })

      if (result && result.data && result.data.length > 0) {
        return result.data.map((row) => ({
          id: row[0],
          problemTitle: row[1],
          leetcodeUrl: row[2],
          difficulty: row[3],
          patternId: row[4],
          patternName: row[5],
          result: row[6],
          timeTakenMinutes: row[7],
          mistakeCategory: row[8] || null,
          notes: row[9] || '',
          codeSnippet: row[10] || '',
          createdAt: row[11],
        }))
      }
    } catch (err) {
      console.warn(`[AttemptService] Cypher fetch warning: ${err.message}. Using store fallback.`)
    }
  }

  // Fallback to in-memory store
  let attempts = inMemoryStore.getUserAttempts(userId)

  if (filters.patternId) {
    const norm = normalizePatternId(filters.patternId)
    attempts = attempts.filter((a) => a.patternId === norm)
  }
  if (filters.difficulty) {
    attempts = attempts.filter((a) => a.difficulty === filters.difficulty)
  }
  if (filters.result) {
    attempts = attempts.filter((a) => a.result === filters.result)
  }

  const limit = filters.limit || 50
  return attempts.slice(0, limit)
}
