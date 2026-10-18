import { useState } from 'react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function RevisionHistoryList({
  revisions = [],
  loading = false,
  onSelectRevision = () => {},
  onRefresh = () => {},
}) {
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'PENDING' | 'COMPLETED'

  const filtered = revisions.filter((r) => {
    if (statusFilter === 'ALL') return true
    return r.status === statusFilter
  })

  function formatDate(isoString) {
    if (!isoString) return ''
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="space-y-4">
      {/* Header & Filter Tabs */}
      <Card className="p-4 bg-white border border-[#E8E2D8]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-[#1C1C1C]">
              Revision Tasks & History
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#5C4033] font-semibold">
              {revisions.length} Total
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex items-center bg-[#FAF7F2] border border-[#E8E2D8] p-0.5 rounded-xl text-xs">
              {['ALL', 'PENDING', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#1C1C1C] shadow-2xs font-semibold'
                      : 'text-[#8C7E72] hover:text-[#1C1C1C]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={onRefresh} className="text-xs">
              ↻
            </Button>
          </div>
        </div>
      </Card>

      {/* Revisions List */}
      {loading ? (
        <div className="p-8 text-center bg-white border border-[#E8E2D8] rounded-2xl">
          <p className="text-xs text-[#8C7E72]">Loading revision records...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center bg-[#FAF7F2]">
          <div className="max-w-sm mx-auto space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#8C7E72]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-[#1C1C1C]">
              No {statusFilter === 'ALL' ? '' : statusFilter.toLowerCase()} Revisions Found
            </h4>
            <p className="text-xs text-[#8C7E72]">
              Run AI agent analysis to generate targeted revision tasks and checklists.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((rev) => {
            const isCompleted = rev.status === 'COMPLETED'

            return (
              <Card
                key={rev.id}
                className="p-5 bg-white border border-[#E8E2D8] hover:border-[#57B2A0]/50 transition-all space-y-3"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isCompleted ? 'mint' : 'terracotta'}
                      size="xs"
                      dot
                    >
                      {rev.status}
                    </Badge>

                    <h4 className="text-sm font-bold text-[#1C1C1C]">
                      {rev.patternName || rev.patternId}
                    </h4>

                    {rev.source && (
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#FAF7F2] border border-[#E8E2D8] text-[#8C7E72]">
                        {rev.source}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-[#8C7E72]">
                    {formatDate(rev.createdAt)}
                  </span>
                </div>

                {/* Reason & Recommendation */}
                <div className="space-y-1">
                  <p className="text-xs text-[#5C4033] font-medium">
                    {rev.recommendation || rev.reason}
                  </p>
                  {rev.focusProblem && (
                    <p className="text-[11px] text-[#8C7E72]">
                      <span className="font-semibold text-[#5C4033]">Target Drill:</span> {rev.focusProblem}
                    </p>
                  )}
                </div>

                {/* Checklist Summary */}
                {rev.checklist?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#8C7E72] uppercase tracking-wider block">
                      Checklist Steps ({rev.checklist.length})
                    </span>
                    <ul className="text-xs text-[#1C1C1C] space-y-1 pl-1">
                      {rev.checklist.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#57B2A0] font-bold">✓</span>
                          <span className="text-[#5C4033] text-[11px] truncate">
                            {item}
                          </span>
                        </li>
                      ))}
                      {rev.checklist.length > 3 && (
                        <li className="text-[10px] text-[#8C7E72] italic pl-3">
                          +{rev.checklist.length - 3} more procedural rules
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Reflection Notes (if completed) */}
                {rev.reflectionNotes && (
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs leading-none">💡</span>
                      <span className="text-[11px] font-bold text-[#1C1C1C]">
                        Learner Reflection & Breakthrough
                      </span>
                    </div>
                    <p className="text-xs text-[#5C4033] leading-relaxed italic pl-4">
                      "{rev.reflectionNotes}"
                    </p>
                  </div>
                )}

                {/* Card Actions */}
                {!isCompleted && (
                  <div className="flex items-center justify-end pt-2 border-t border-[#E8E2D8]/60">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelectRevision(rev)}
                      className="text-xs py-1 h-7"
                    >
                      Focus Checklist & Complete
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
