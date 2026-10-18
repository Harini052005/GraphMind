import { useState, useRef, useMemo } from 'react'
import Badge from '../ui/Badge'

// Default pedagogical layout coordinates for the 8 core DSA concepts
const NODE_LAYOUT = {
  'arrays-hashing': { x: 60, y: 110 },
  'two-pointers': { x: 350, y: 55 },
  'sliding-window': { x: 640, y: 55 },
  'binary-search': { x: 350, y: 185 },
  'recursion-backtracking': { x: 60, y: 395 },
  'tree-traversal': { x: 350, y: 340 },
  'graph-algorithms': { x: 640, y: 340 },
  'dynamic-programming': { x: 350, y: 475 },
}

const CARD_WIDTH = 220
const CARD_HEIGHT = 96

export default function MemoryGraphCanvas({
  nodes = [],
  edges = [],
  selectedId = null,
  onSelect = () => {},
  searchQuery = '',
  statusFilter = 'ALL',
}) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredNodeId, setHoveredNodeId] = useState(null)
  const containerRef = useRef(null)

  // Map nodes to coordinates with fallback positioning for dynamic nodes
  const positionedNodes = useMemo(() => {
    return nodes.map((node, index) => {
      const defaultPos = NODE_LAYOUT[node.id] || {
        x: 60 + (index % 3) * 290,
        y: 600 + Math.floor(index / 3) * 130,
      }
      return {
        ...node,
        x: defaultPos.x,
        y: defaultPos.y,
        centerX: defaultPos.x + CARD_WIDTH / 2,
        centerY: defaultPos.y + CARD_HEIGHT / 2,
      }
    })
  }, [nodes])

  const nodeMap = useMemo(() => {
    const map = new Map()
    positionedNodes.forEach((n) => map.set(n.id, n))
    return map
  }, [positionedNodes])

  // Active connected node IDs for highlighting
  const activeNodeId = hoveredNodeId || selectedId
  const connectedEdgeSet = useMemo(() => {
    const set = new Set()
    if (!activeNodeId) return set
    edges.forEach((edge, idx) => {
      if (edge.from === activeNodeId || edge.to === activeNodeId) {
        set.add(idx)
      }
    })
    return set
  }, [edges, activeNodeId])

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    // Only drag on canvas background
    if (e.target === containerRef.current || e.target.tagName === 'svg' || e.target.classList.contains('canvas-bg')) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 1.8))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.5))

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-full overflow-hidden select-none bg-[#FAF7F2] canvas-bg cursor-grab active:cursor-grabbing"
    >
      {/* Background Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle, #B8AEA2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-[#E8E2D8] rounded-xl p-1 shadow-xs">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] text-[#1C1C1C] text-sm font-bold transition-colors cursor-pointer"
        >
          +
        </button>
        <span className="text-[11px] font-mono text-[#8C7E72] px-1.5 min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] text-[#1C1C1C] text-sm font-bold transition-colors cursor-pointer"
        >
          -
        </button>
        <div className="w-[1px] h-4 bg-[#E8E2D8] mx-0.5" />
        <button
          onClick={handleResetZoom}
          title="Reset Zoom & Pan"
          className="px-2 h-7 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] text-[#5C4033] text-xs font-medium transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Canvas Canvas Workspace (Scaled & Panned) */}
      <div
        className="absolute inset-0 origin-top-left transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: '960px',
          height: '620px',
        }}
      >
        {/* SVG Edges Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: '960px', height: '620px' }}
        >
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#B8AEA2" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#57B2A0" />
            </marker>
          </defs>

          {edges.map((edge, idx) => {
            const sourceNode = nodeMap.get(edge.from)
            const targetNode = nodeMap.get(edge.to)
            if (!sourceNode || !targetNode) return null

            // Connect from right side of source to left side of target
            const startX = sourceNode.x + CARD_WIDTH
            const startY = sourceNode.y + CARD_HEIGHT / 2
            const endX = targetNode.x
            const endY = targetNode.y + CARD_HEIGHT / 2

            // Bezier control points for smooth S-curves
            const dx = Math.max(Math.abs(endX - startX) * 0.5, 40)
            const c1x = startX + dx
            const c1y = startY
            const c2x = endX - dx
            const c2y = endY

            const midX = (startX + endX) / 2
            const midY = (startY + endY) / 2

            const isEdgeActive = connectedEdgeSet.has(idx)

            return (
              <g key={`${edge.from}-${edge.to}-${idx}`}>
                {/* Connector Curve */}
                <path
                  d={`M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`}
                  stroke={isEdgeActive ? '#57B2A0' : '#B8AEA2'}
                  strokeWidth={isEdgeActive ? '2.5' : '1.5'}
                  strokeDasharray={isEdgeActive ? 'none' : '4 4'}
                  fill="none"
                  markerEnd={isEdgeActive ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                  className="transition-colors duration-200"
                />

                {/* Relationship Pill */}
                {edge.relation && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-42"
                      y="-10"
                      width="84"
                      height="20"
                      rx="10"
                      fill={isEdgeActive ? '#FFFFFF' : '#FAF7F2'}
                      stroke={isEdgeActive ? '#57B2A0' : '#E8E2D8'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={isEdgeActive ? '#215d52' : '#8C7E72'}
                      fontSize="9.5"
                      fontFamily="inherit"
                      fontWeight="600"
                    >
                      {edge.relation.replace('_', ' ')}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>

        {/* Nodes Layer */}
        {positionedNodes.map((node) => {
          const isSelected = selectedId === node.id
          const isHovered = hoveredNodeId === node.id
          const isConnected =
            activeNodeId &&
            edges.some(
              (e) =>
                (e.from === activeNodeId && e.to === node.id) ||
                (e.to === activeNodeId && e.from === node.id)
            )

          const isMatchingSearch =
            searchQuery.trim() === '' ||
            node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.category?.toLowerCase().includes(searchQuery.toLowerCase())

          const isMatchingStatus =
            statusFilter === 'ALL'
              ? true
              : statusFilter === 'Needs Revision'
              ? node.status === 'Needs Revision' || node.status === 'Critical'
              : node.status === statusFilter

          const isMatchingFilter = isMatchingSearch && isMatchingStatus

          const score = typeof node.score === 'number' ? node.score : 0
          const status = node.status || 'Unpracticed'
          const totalAttempts = node.metrics?.totalAttempts || 0
          const solvedCount = node.metrics?.solvedCount || 0

          // Status indicator pill configuration
          const statusConfig = {
            Stable: {
              badgeVariant: 'mint',
              label: 'Stable',
              dotColor: 'bg-[#57B2A0]',
            },
            'Needs Revision': {
              badgeVariant: 'terracotta',
              label: 'Needs Revision',
              dotColor: 'bg-[#D97757]',
            },
            Critical: {
              badgeVariant: 'terracotta',
              label: 'Critical',
              dotColor: 'bg-[#D97757]',
            },
            Unpracticed: {
              badgeVariant: 'muted',
              label: 'Unpracticed',
              dotColor: 'bg-[#8C7E72]',
            },
          }[status] || {
            badgeVariant: 'muted',
            label: status,
            dotColor: 'bg-[#8C7E72]',
          }

          return (
            <div
              key={node.id}
              onClick={() => onSelect(node.id)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
              }}
              className={`group rounded-xl p-3 border transition-all duration-200 cursor-pointer select-none ${
                !isMatchingFilter ? 'opacity-25 grayscale pointer-events-none' : 'opacity-100'
              } ${
                isSelected
                  ? 'bg-white border-[#57B2A0] shadow-md ring-2 ring-[#57B2A0]/40 translate-y-[-2px]'
                  : isConnected
                  ? 'bg-white border-[#98D8B0] shadow-xs translate-y-[-1px]'
                  : isHovered
                  ? 'bg-white border-[#57B2A0] shadow-xs'
                  : 'bg-white border-[#E8E2D8] hover:border-[#57B2A0] hover:shadow-xs'
              }`}
            >
              {/* Card Header: Category & Score Badge */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-medium text-[#8C7E72] uppercase tracking-wider truncate max-w-[125px]">
                  {node.category || 'DSA Pattern'}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#1C1C1C] text-white shrink-0 shadow-2xs">
                  {score}/10
                </span>
              </div>

              {/* Concept Name */}
              <h3 className="text-sm font-semibold text-[#1C1C1C] truncate group-hover:text-[#57B2A0] transition-colors">
                {node.name}
              </h3>

              {/* Footer: Status Pill & Attempts Subtitle */}
              <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-[#E8E2D8]/50">
                <Badge
                  variant={statusConfig.badgeVariant}
                  size="xs"
                  dot
                  dotColor={statusConfig.dotColor}
                >
                  {statusConfig.label}
                </Badge>

                <span className="text-[11px] text-[#8C7E72] font-mono">
                  {totalAttempts > 0
                    ? `${solvedCount}/${totalAttempts} solved`
                    : '0 attempts'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Legend */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-[#E8E2D8] px-3 py-1.5 rounded-xl text-xs text-[#5C4033] shadow-xs">
        <span className="font-semibold text-[#1C1C1C]">Mastery:</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#57B2A0]" />
          Stable
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#D97757]" />
          Needs Revision / Critical
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8C7E72]" />
          Unpracticed
        </span>
        <div className="w-[1px] h-3.5 bg-[#E8E2D8] mx-0.5" />
        <span className="inline-flex items-center gap-1.5 text-[#8C7E72]">
          <span className="w-4 h-[1px] border-b border-dashed border-[#B8AEA2]" />
          Prerequisite Dependency
        </span>
      </div>
    </div>
  )
}
