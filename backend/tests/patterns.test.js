import { describe, it, expect } from 'vitest'
import { DSA_PATTERNS, PREREQUISITE_EDGES } from '../src/graph/patternsData.js'
import { getPatternsGraph } from '../src/graph/store.js'

describe('Semantic DSA Patterns Graph', () => {
  it('should define all 8 essential DSA patterns with correct metadata', () => {
    expect(DSA_PATTERNS).toHaveLength(8)
    const ids = DSA_PATTERNS.map((p) => p.id)
    expect(ids).toContain('two-pointers')
    expect(ids).toContain('sliding-window')
    expect(ids).toContain('binary-search')
    expect(ids).toContain('recursion-backtracking')
    expect(ids).toContain('tree-traversal')
    expect(ids).toContain('graph-algorithms')
    expect(ids).toContain('dynamic-programming')
  })

  it('should ensure all prerequisite edges point to valid pattern IDs', () => {
    const patternIds = new Set(DSA_PATTERNS.map((p) => p.id))
    for (const edge of PREREQUISITE_EDGES) {
      expect(patternIds.has(edge.from)).toBe(true)
      expect(patternIds.has(edge.to)).toBe(true)
      expect(edge.relation).toBeTruthy()
    }
  })

  it('should return complete graph schema with nodes and edges via getPatternsGraph', async () => {
    const graph = await getPatternsGraph('test-user')
    expect(graph).toHaveProperty('nodes')
    expect(graph).toHaveProperty('edges')
    expect(graph).toHaveProperty('summary')

    expect(graph.nodes.length).toBe(8)
    expect(graph.edges.length).toBe(PREREQUISITE_EDGES.length)

    // Check node shape
    const firstNode = graph.nodes[0]
    expect(firstNode).toHaveProperty('id')
    expect(firstNode).toHaveProperty('name')
    expect(firstNode).toHaveProperty('score')
    expect(firstNode).toHaveProperty('status')
    expect(firstNode).toHaveProperty('metrics')
  })
})
