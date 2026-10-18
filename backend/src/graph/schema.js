import { executeQuery, checkFalkorHealth } from './client.js'
import { DSA_PATTERNS, PREREQUISITE_EDGES } from './patternsData.js'

/**
 * Initializes FalkorDB schema indexes for high performance query lookups.
 */
export async function initializeSchema() {
  const health = await checkFalkorHealth()
  if (!health.connected) {
    console.log('[Schema] FalkorDB not connected. Skipping remote index creation (In-memory store will be used).')
    return { success: false, reason: 'FalkorDB offline' }
  }

  const indexes = [
    'CREATE INDEX FOR (u:User) ON (u.id)',
    'CREATE INDEX FOR (p:Problem) ON (p.id)',
    'CREATE INDEX FOR (pt:Pattern) ON (pt.id)',
    'CREATE INDEX FOR (pt:Pattern) ON (pt.name)',
    'CREATE INDEX FOR (m:Mistake) ON (m.category)',
    'CREATE INDEX FOR (a:Attempt) ON (a.id)',
    'CREATE INDEX FOR (r:Revision) ON (r.id)',
  ]

  console.log('[Schema] Creating FalkorDB indexes...')
  for (const query of indexes) {
    try {
      await executeQuery(query)
    } catch (err) {
      // Ignore if index already exists
      if (!err.message?.includes('already exists') && !err.message?.includes('Index already exists')) {
        console.warn(`[Schema] Index notice: ${err.message}`)
      }
    }
  }

  return { success: true }
}

/**
 * Seeds foundational Semantic DSA Patterns and Prerequisite relationship edges.
 * Uses MERGE to guarantee idempotent execution without duplicate nodes or edges.
 */
export async function seedSemanticPatterns() {
  const health = await checkFalkorHealth()
  if (!health.connected) {
    console.log('[Seed] FalkorDB not connected. Semantic patterns will be served via in-memory store.')
    return { count: DSA_PATTERNS.length, source: 'in-memory' }
  }

  console.log('[Seed] Seeding Semantic DSA Patterns into FalkorDB...')
  for (const pattern of DSA_PATTERNS) {
    await executeQuery(
      `MERGE (p:Pattern { id: $id })
       SET p.name = $name,
           p.category = $category,
           p.description = $description,
           p.difficulty = $difficulty,
           p.recommendedOrder = $recommendedOrder`,
      {
        id: pattern.id,
        name: pattern.name,
        category: pattern.category,
        description: pattern.description,
        difficulty: pattern.difficulty,
        recommendedOrder: pattern.recommendedOrder,
      }
    )
  }

  console.log('[Seed] Seeding Prerequisite dependency edges into FalkorDB...')
  for (const edge of PREREQUISITE_EDGES) {
    await executeQuery(
      `MATCH (from:Pattern { id: $fromId })
       MATCH (to:Pattern { id: $toId })
       MERGE (from)-[r:PREREQUISITE_FOR { relation: $relation }]->(to)
       SET r.description = $description`,
      {
        fromId: edge.from,
        toId: edge.to,
        relation: edge.relation,
        description: edge.description,
      }
    )
  }

  console.log(`[Seed] Seeded ${DSA_PATTERNS.length} patterns and ${PREREQUISITE_EDGES.length} dependency edges.`)
  return { count: DSA_PATTERNS.length, edges: PREREQUISITE_EDGES.length, source: 'falkordb' }
}
