import { executeQuery, checkFalkorHealth } from './client.js'
import { DSA_PATTERNS, PREREQUISITE_EDGES } from './patternsData.js'

/**
 * In-memory fallback graph store.
 * Keeps track of attempts, mistakes, revisions, and pattern stats when FalkorDB is offline.
 */
class InMemoryGraphStore {
  constructor() {
    this.users = new Map()
    this.problems = new Map()
    this.attempts = []
    this.revisions = []
  }

  getUserAttempts(userId) {
    return this.attempts.filter((a) => a.userId === userId)
  }

  recordAttempt(data) {
    const attempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      ...data,
    }
    this.attempts.unshift(attempt)
    return attempt
  }

  getRevisions(userId) {
    return this.revisions.filter((r) => r.userId === userId)
  }

  createRevision(data) {
    const revision = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      ...data,
    }
    this.revisions.unshift(revision)
    return revision
  }

  updateRevision(id, updates) {
    const rev = this.revisions.find((r) => r.id === id)
    if (!rev) return null
    Object.assign(rev, updates)
    if (updates.status === 'COMPLETED' && !rev.completedAt) {
      rev.completedAt = new Date().toISOString()
    }
    return rev
  }
}

export const inMemoryStore = new InMemoryGraphStore()

/**
 * Retrieves the complete semantic pattern graph with user-specific mastery statistics.
 * If FalkorDB is live, executes Cypher queries. Otherwise, evaluates against in-memory memory.
 * 
 * @param {string} userId - User identifier for tenant isolation
 */
export async function getPatternsGraph(userId = 'demo-user') {
  const health = await checkFalkorHealth()

  // Base patterns and prerequisite edges
  const patterns = [...DSA_PATTERNS]
  const edges = [...PREREQUISITE_EDGES]

  let userAttempts = []

  if (health.connected) {
    try {
      // Parameterized Cypher query to retrieve user's attempts per pattern
      const cypher = `
        MATCH (u:User { id: $userId })-[:MADE_ATTEMPT]->(a:Attempt)-[:FOR_PROBLEM]->(p:Problem)-[:USES_PATTERN]->(pt:Pattern)
        OPTIONAL MATCH (a)-[:HAD_MISTAKE]->(m:Mistake)
        RETURN pt.id AS patternId,
               a.result AS result,
               a.timeTakenMinutes AS timeTaken,
               m.category AS mistakeCategory,
               a.createdAt AS createdAt
      `
      const result = await executeQuery(cypher, { userId })
      if (result && result.data) {
        userAttempts = result.data.map((row) => ({
          patternId: row.patternId ?? row[0],
          result: row.result ?? row[1],
          timeTakenMinutes: row.timeTaken ?? row.timeTakenMinutes ?? row[2],
          mistakeCategory: row.mistakeCategory ?? row[3],
          createdAt: row.createdAt ?? row[4],
        }))
      }
    } catch (err) {
      console.warn(`[GraphStore] Cypher query warning: ${err.message}. Using fallback.`)
      userAttempts = inMemoryStore.getUserAttempts(userId)
    }
  } else {
    userAttempts = inMemoryStore.getUserAttempts(userId)
  }

  // Calculate statistics for each pattern node
  const nodes = patterns.map((p) => {
    const attemptsForPattern = userAttempts.filter(
      (a) => a.patternId === p.id || a.patternId === p.name
    )

    const total = attemptsForPattern.length
    const solved = attemptsForPattern.filter((a) => a.result === 'Solved').length
    const failed = attemptsForPattern.filter((a) => a.result === 'Failed').length
    const attempted = attemptsForPattern.filter((a) => a.result === 'Attempted').length

    // Mistake clusters
    const mistakes = attemptsForPattern
      .filter((a) => a.mistakeCategory)
      .map((a) => a.mistakeCategory)

    const mistakeMap = {}
    mistakes.forEach((m) => {
      mistakeMap[m] = (mistakeMap[m] || 0) + 1
    })

    const repeatedMistakes = Object.entries(mistakeMap).map(([category, count]) => ({
      category,
      count,
    }))

    // Calculate mastery score (0 to 10)
    let score = 0
    let status = 'Unpracticed' // 'Unpracticed' | 'Stable' | 'Needs Revision' | 'Critical'

    if (total > 0) {
      const successRate = solved / total
      score = Math.round(successRate * 10)

      if (successRate >= 0.75 && failed === 0) {
        status = 'Stable'
      } else if (successRate < 0.5 || repeatedMistakes.some((m) => m.count >= 2)) {
        status = 'Critical'
      } else {
        status = 'Needs Revision'
      }
    }

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      difficulty: p.difficulty,
      recommendedOrder: p.recommendedOrder,
      score,
      status,
      metrics: {
        totalAttempts: total,
        solvedCount: solved,
        failedCount: failed,
        attemptedCount: attempted,
        successRate: total > 0 ? Math.round((solved / total) * 100) : 0,
        misconceptionClusters: repeatedMistakes.length,
        repeatedMistakes,
      },
    }
  })

  return {
    nodes,
    edges,
    summary: {
      totalConcepts: nodes.length,
      totalDependencies: edges.length,
      stableCount: nodes.filter((n) => n.status === 'Stable').length,
      needsRevisionCount: nodes.filter((n) => n.status === 'Needs Revision' || n.status === 'Critical').length,
      unpracticedCount: nodes.filter((n) => n.status === 'Unpracticed').length,
      dataSource: health.connected ? 'falkordb-cloud' : 'in-memory-fallback',
    },
  }
}
