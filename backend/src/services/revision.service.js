import { executeQuery, checkFalkorHealth } from '../graph/client.js'
import { inMemoryStore } from '../graph/store.js'
import { getProceduralChecklist } from './checklist.service.js'

/**
 * Creates a revision task linked to User and Pattern in FalkorDB / in-memory store.
 * 
 * @param {string} userId - User identifier
 * @param {object} payload - { patternId, reason, recommendation, checklist, focusProblem, source }
 */
export async function createRevisionService(userId = 'demo-user', payload) {
  const health = await checkFalkorHealth()
  const revisionId = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  const createdAt = new Date().toISOString()

  // Generate default checklist if not supplied
  const checklist = payload.checklist && payload.checklist.length > 0
    ? payload.checklist
    : getProceduralChecklist(payload.patternId, payload.mistakeCategory)

  const revisionRecord = {
    id: revisionId,
    userId,
    patternId: payload.patternId,
    reason: payload.reason,
    recommendation: payload.recommendation,
    checklist,
    focusProblem: payload.focusProblem || '',
    status: 'PENDING',
    source: payload.source || 'agent', // 'agent' | 'manual'
    createdAt,
    completedAt: null,
    reflectionNotes: '',
  }

  if (health.connected) {
    try {
      const cypher = `
        MERGE (u:User { id: $userId })
        MERGE (pt:Pattern { id: $patternId })
        CREATE (r:Revision {
          id: $revisionId,
          reason: $reason,
          recommendation: $recommendation,
          checklist: $checklistJson,
          focusProblem: $focusProblem,
          status: 'PENDING',
          source: $source,
          createdAt: $createdAt
        })
        CREATE (u)-[:HAS_REVISION]->(r)
        CREATE (r)-[:TARGETS]->(pt)
        RETURN r.id AS id
      `
      await executeQuery(cypher, {
        userId,
        patternId: payload.patternId,
        revisionId,
        reason: payload.reason,
        recommendation: payload.recommendation,
        checklistJson: JSON.stringify(checklist),
        focusProblem: payload.focusProblem || '',
        source: payload.source || 'agent',
        createdAt,
      })

      inMemoryStore.createRevision(revisionRecord)
      return { ...revisionRecord, storage: 'falkordb-cloud' }
    } catch (err) {
      console.warn(`[RevisionService] Cypher insert warning: ${err.message}. Using in-memory store.`)
      const saved = inMemoryStore.createRevision(revisionRecord)
      return { ...saved, storage: 'in-memory-fallback' }
    }
  } else {
    const saved = inMemoryStore.createRevision(revisionRecord)
    return { ...saved, storage: 'in-memory-fallback' }
  }
}

/**
 * Retrieves all revision tasks for a user.
 */
export async function getRevisionsService(userId = 'demo-user', filters = {}) {
  const health = await checkFalkorHealth()

  if (health.connected) {
    try {
      const cypher = `
        MATCH (u:User { id: $userId })-[:HAS_REVISION]->(r:Revision)-[:TARGETS]->(pt:Pattern)
        RETURN r.id AS id,
               pt.id AS patternId,
               pt.name AS patternName,
               r.reason AS reason,
               r.recommendation AS recommendation,
               r.checklist AS checklist,
               r.focusProblem AS focusProblem,
               r.status AS status,
               r.source AS source,
               r.reflectionNotes AS reflectionNotes,
               r.createdAt AS createdAt,
               r.completedAt AS completedAt
        ORDER BY r.createdAt DESC
      `
      const result = await executeQuery(cypher, { userId })
      if (result && result.data && result.data.length > 0) {
        return result.data.map((row) => ({
          id: row.id ?? row[0],
          patternId: row.patternId ?? row[1],
          patternName: row.patternName ?? row[2],
          reason: row.reason ?? row[3],
          recommendation: row.recommendation ?? row[4],
          checklist: typeof (row.checklist ?? row[5]) === 'string'
            ? JSON.parse((row.checklist ?? row[5]) || '[]')
            : (row.checklist ?? row[5]) || [],
          focusProblem: row.focusProblem ?? row[6] ?? '',
          status: row.status ?? row[7],
          source: row.source ?? row[8] ?? 'agent',
          reflectionNotes: row.reflectionNotes ?? row[9] ?? '',
          createdAt: row.createdAt ?? row[10],
          completedAt: row.completedAt ?? row[11] ?? null,
        }))
      }
    } catch (err) {
      console.warn(`[RevisionService] Cypher query warning: ${err.message}. Using store fallback.`)
    }
  }

  let list = inMemoryStore.getRevisions(userId)
  if (filters.status) {
    list = list.filter((r) => r.status === filters.status)
  }
  return list
}

/**
 * Updates a revision task status (e.g. PENDING -> COMPLETED).
 */
export async function updateRevisionStatusService(userId, revisionId, updates = {}) {
  const health = await checkFalkorHealth()
  const { status, reflectionNotes } = updates

  if (health.connected) {
    try {
      const cypher = `
        MATCH (u:User { id: $userId })-[:HAS_REVISION]->(r:Revision { id: $revisionId })
        SET r.status = $status,
            r.reflectionNotes = $reflectionNotes,
            r.completedAt = CASE WHEN $status = 'COMPLETED' THEN $completedAt ELSE r.completedAt END
        RETURN r.id AS id, r.status AS status
      `
      await executeQuery(cypher, {
        userId,
        revisionId,
        status: status || 'COMPLETED',
        reflectionNotes: reflectionNotes || '',
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.warn(`[RevisionService] Cypher update warning: ${err.message}. Mirroring in store.`)
    }
  }

  return inMemoryStore.updateRevision(revisionId, {
    status: status || 'COMPLETED',
    reflectionNotes: reflectionNotes || '',
  })
}
