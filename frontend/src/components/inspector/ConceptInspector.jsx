import { useState } from 'react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

export default function ConceptInspector({
  node = null,
  allEdges = [],
  allNodes = [],
  onRequestRevision = null,
}) {
  const [taskRequested, setTaskRequested] = useState(false)

  if (!node) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-[#8C7E72]">
        <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center mb-3 text-xl">
          🔍
        </div>
        <p className="text-sm font-medium">Select any concept node in the memory graph</p>
        <p className="text-xs text-[#8C7E72] mt-1">View mastery breakdown, root causes, and repeated mistakes</p>
      </Card>
    )
  }

  const metrics = node.metrics || {
    totalAttempts: 0,
    solvedCount: 0,
    failedCount: 0,
    attemptedCount: 0,
    successRate: 0,
    misconceptionClusters: 0,
    repeatedMistakes: [],
  }

  // Incoming prerequisite edges (Dependencies: what this concept requires)
  const incomingEdges = allEdges.filter((e) => e.to === node.id)
  // Outgoing prerequisite edges (Dependents: what this concept unlocks)
  const outgoingEdges = allEdges.filter((e) => e.from === node.id)

  const nodeMap = new Map(allNodes.map((n) => [n.id, n]))

  const statusConfig = {
    Stable: {
      variant: 'mint',
      dotColor: 'bg-[#57B2A0]',
      label: 'Stable Mastery',
    },
    'Needs Revision': {
      variant: 'terracotta',
      dotColor: 'bg-[#D97757]',
      label: 'Needs Revision',
    },
    Critical: {
      variant: 'terracotta',
      dotColor: 'bg-[#D97757]',
      label: 'Critical Weakness',
    },
    Unpracticed: {
      variant: 'muted',
      dotColor: 'bg-[#8C7E72]',
      label: 'Unpracticed',
    },
  }[node.status] || {
    variant: 'muted',
    dotColor: 'bg-[#8C7E72]',
    label: node.status || 'Unpracticed',
  }

  const handleRequestTask = () => {
    setTaskRequested(true)
    if (onRequestRevision) {
      onRequestRevision(node)
    }
    setTimeout(() => {
      setTaskRequested(false)
    }, 3500)
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-white shadow-xs">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Header Section */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold tracking-wider text-[#8C7E72] uppercase">
              {node.category || 'DSA Concept'}
            </span>
            <Badge
              variant={statusConfig.variant}
              size="xs"
              dot
              dotColor={statusConfig.dotColor}
            >
              {statusConfig.label}
            </Badge>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-[#1C1C1C] leading-snug">
              {node.name}
            </h2>
            <div className="flex flex-col items-center justify-center bg-[#1C1C1C] text-white px-3 py-1 rounded-xl shrink-0">
              <span className="text-base font-bold font-mono leading-none">
                {typeof node.score === 'number' ? node.score : 0}
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-[#98D8B0] uppercase mt-0.5">
                Score
              </span>
            </div>
          </div>

          {node.description && (
            <p className="text-xs text-[#5C4033] mt-2 leading-relaxed">
              {node.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3">
            {node.difficulty && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8E2D8] text-[#5C4033]">
                Level: {node.difficulty}
              </span>
            )}
            {node.recommendedOrder && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8E2D8] text-[#8C7E72]">
                Order: #{node.recommendedOrder}
              </span>
            )}
          </div>
        </div>

        {/* Score & Attempt Breakdown Card */}
        <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1C1C1C]">
              Mastery Performance
            </span>
            <span className="text-xs font-mono font-bold text-[#57B2A0]">
              {metrics.successRate}% Success Rate
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#E8E2D8] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                metrics.successRate >= 70
                  ? 'bg-[#57B2A0]'
                  : metrics.successRate >= 40
                  ? 'bg-[#98D8B0]'
                  : 'bg-[#D97757]'
              }`}
              style={{ width: `${Math.max(metrics.successRate, 4)}%` }}
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-white border border-[#E8E2D8] rounded-lg p-2">
              <span className="text-xs text-[#8C7E72] block">Attempts</span>
              <span className="text-sm font-bold font-mono text-[#1C1C1C]">
                {metrics.totalAttempts}
              </span>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-lg p-2">
              <span className="text-xs text-[#8C7E72] block">Solved</span>
              <span className="text-sm font-bold font-mono text-[#18533b]">
                {metrics.solvedCount}
              </span>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-lg p-2">
              <span className="text-xs text-[#8C7E72] block">Failed</span>
              <span className="text-sm font-bold font-mono text-[#D97757]">
                {metrics.failedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Misconceptions & Repeated Mistakes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-[#1C1C1C] flex items-center gap-1.5">
              <span>Repeated Mistakes</span>
              {metrics.misconceptionClusters > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D97757]/15 text-[#D97757] text-[10px] font-bold inline-flex items-center justify-center">
                  {metrics.misconceptionClusters}
                </span>
              )}
            </h3>
          </div>

          {metrics.repeatedMistakes && metrics.repeatedMistakes.length > 0 ? (
            <div className="space-y-1.5">
              {metrics.repeatedMistakes.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#FCE8E1]/60 border border-[#D97757]/30 text-xs text-[#D97757]"
                >
                  <span className="font-medium flex items-center gap-1.5">
                    <span className="text-sm leading-none">⚠️</span>
                    {m.category}
                  </span>
                  <span className="font-mono font-semibold px-2 py-0.5 rounded bg-white/80 border border-[#D97757]/30 text-[11px]">
                    {m.count} {m.count === 1 ? 'time' : 'times'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#8C7E72] italic text-center">
              No repeated mistakes recorded for this pattern.
            </div>
          )}
        </div>

        {/* Root Cause Analysis Breadcrumb & Lineage */}
        <div>
          <h3 className="text-xs font-semibold text-[#1C1C1C] mb-2">
            Knowledge Lineage & Root Cause
          </h3>

          <div className="space-y-2 text-xs">
            {incomingEdges.length > 0 ? (
              incomingEdges.map((edge, idx) => {
                const source = nodeMap.get(edge.from)
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-[#5C4033] font-medium">
                      <span className="text-[#57B2A0] font-bold">←</span>
                      <span>Requires:</span>
                      <strong className="text-[#1C1C1C]">
                        {source ? source.name : edge.from}
                      </strong>
                    </div>
                    {edge.description && (
                      <p className="text-[11px] text-[#8C7E72] pl-3 border-l-2 border-[#57B2A0]/40 italic">
                        "{edge.description}"
                      </p>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] text-[11px] text-[#8C7E72]">
                Foundational pattern — no incoming prerequisites required.
              </div>
            )}

            {outgoingEdges.length > 0 && (
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] space-y-1">
                <span className="text-[#5C4033] font-medium block">
                  Enables Higher Patterns:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {outgoingEdges.map((edge, idx) => {
                    const target = nodeMap.get(edge.to)
                    return (
                      <Badge key={idx} variant="sage" size="xs">
                        → {target ? target.name : edge.to}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button Footer */}
      <div className="p-4 border-t border-[#E8E2D8] bg-[#FAF7F2]/50">
        <Button
          variant="primary"
          size="md"
          className="w-full text-xs"
          onClick={handleRequestTask}
          disabled={taskRequested}
        >
          {taskRequested ? (
            <span className="flex items-center gap-1.5">
              <span>✓</span> Revision Task Added
            </span>
          ) : (
            <span>+ Add Revision Task</span>
          )}
        </Button>
        {taskRequested && (
          <p className="text-[11px] text-[#57B2A0] text-center font-medium mt-1.5 animate-fade-in">
            Revision task added for {node.name}. View in Revision Planner.
          </p>
        )}
      </div>
    </Card>
  )
}
