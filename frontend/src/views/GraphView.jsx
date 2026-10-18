import { useState, useEffect } from 'react'
import { fetchPatternsGraph } from '../services/api/graphApi'
import MemoryGraphCanvas from '../components/graph/MemoryGraphCanvas'
import ConceptInspector from '../components/inspector/ConceptInspector'
import Badge from '../components/ui/Badge'

export default function GraphView() {
  const [data, setData] = useState(null)
  const [selectedNodeId, setSelectedNodeId] = useState('recursion-backtracking')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'Stable' | 'Needs Revision' | 'Unpracticed'
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let isMounted = true
    fetchPatternsGraph()
      .then((res) => {
        if (isMounted) {
          setData(res)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load memory graph')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    fetchPatternsGraph()
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load memory graph')
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-[#5C4033]">
        <div className="w-8 h-8 rounded-full border-2 border-[#57B2A0] border-t-transparent animate-spin" />
        <span className="text-sm font-medium">Loading Memory Graph & Pattern Lineage...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
        <div className="p-3 bg-[#FCE8E1] text-[#D97757] rounded-xl text-sm font-medium border border-[#D97757]/30">
          {error || 'Unable to load pattern graph'}
        </div>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-[#98D8B0] text-[#1C1C1C] rounded-xl text-xs font-semibold hover:bg-[#86cba0] transition-colors cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  const selectedNode =
    data.nodes.find((n) => n.id === selectedNodeId) || data.nodes[0]

  const summary = data.summary || {
    totalConcepts: data.nodes?.length || 0,
    totalDependencies: data.edges?.length || 0,
    stableCount: data.nodes?.filter((n) => n.status === 'Stable').length || 0,
    needsRevisionCount:
      data.nodes?.filter(
        (n) => n.status === 'Needs Revision' || n.status === 'Critical'
      ).length || 0,
    unpracticedCount:
      data.nodes?.filter((n) => n.status === 'Unpracticed').length || 0,
    dataSource: 'connected',
  }

  return (
    <div className="flex flex-col h-full w-full gap-3">
      {/* Top Knowledge Lineage Summary & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E8E2D8] px-4 py-2.5 rounded-2xl shadow-xs">
        {/* Left: Summary Metrics */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[#1C1C1C]">
            <span>Cognitive Map:</span>
            <span className="font-mono bg-[#FAF7F2] border border-[#E8E2D8] px-2 py-0.5 rounded-md text-[#5C4033]">
              {summary.totalConcepts} Concepts
            </span>
            <span className="font-mono bg-[#FAF7F2] border border-[#E8E2D8] px-2 py-0.5 rounded-md text-[#5C4033]">
              {summary.totalDependencies} Prerequisites
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#E8E2D8]">
            <Badge variant="mint" size="xs">
              {summary.stableCount} Stable
            </Badge>
            <Badge variant="terracotta" size="xs">
              {summary.needsRevisionCount} Needs Revision
            </Badge>
            <Badge variant="muted" size="xs">
              {summary.unpracticedCount} Unpracticed
            </Badge>
          </div>
        </div>

        {/* Right: Search & Quick Status Filters */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pattern..."
              className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl pl-7 pr-3 py-1.5 text-[#1C1C1C] placeholder-[#8C7E72] focus:outline-none focus:ring-2 focus:ring-[#98D8B0] w-36 sm:w-44 transition-all"
            />
            <span className="absolute left-2.5 top-1.5 text-[#8C7E72] text-xs">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-[#8C7E72] hover:text-[#1C1C1C] text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center bg-[#FAF7F2] border border-[#E8E2D8] p-0.5 rounded-xl text-[11px]">
            {['ALL', 'Stable', 'Needs Revision', 'Unpracticed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-[#1C1C1C] shadow-2xs font-semibold'
                    : 'text-[#8C7E72] hover:text-[#1C1C1C]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Graph & Inspector Grid */}
      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden">
        {/* Visual Canvas (takes remaining width) */}
        <div className="flex-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl relative overflow-hidden shadow-xs flex flex-col">
          <MemoryGraphCanvas
            nodes={data.nodes}
            edges={data.edges}
            selectedId={selectedNodeId}
            onSelect={(id) => setSelectedNodeId(id)}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />
        </div>

        {/* Right Inspector Panel (fixed width ~340px) */}
        <div className="w-80 lg:w-92 shrink-0 h-full">
          <ConceptInspector
            node={selectedNode}
            allEdges={data.edges}
            allNodes={data.nodes}
            onRequestRevision={(n) => {
              console.log('Revision requested for:', n.id)
            }}
          />
        </div>
      </div>
    </div>
  )
}
