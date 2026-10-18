import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function WeakPatternsCard({
  weakPatterns = [],
  onOpenLogAttempt = () => {},
}) {
  if (!weakPatterns || weakPatterns.length === 0) {
    return (
      <Card className="p-6 bg-white flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#98D8B0]/20 text-[#57B2A0] flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#1C1C1C]">No Weak Patterns Detected</h3>
        <p className="text-xs text-[#8C7E72] mt-1 max-w-sm">
          All practiced patterns maintain acceptable success rates and no recurring misconception clusters are flagged.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97757]" />
          <h3 className="text-sm font-bold text-[#1C1C1C] uppercase tracking-wider">
            Needs Practice ({weakPatterns.length})
          </h3>
        </div>
        <Badge variant="terracotta" size="xs">
          Priority Focus
        </Badge>
      </div>

      <div className="space-y-3.5">
        {weakPatterns.map((wp) => (
          <div
            key={wp.patternId}
            className="bg-white border border-[#E8E2D8] border-l-4 border-l-[#D97757] rounded-2xl p-5 shadow-xs space-y-3.5 transition-all hover:shadow-sm"
          >
            {/* Header: Name, Score & Status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-[#1C1C1C]">
                    {wp.patternName}
                  </h4>
                  <Badge variant="terracotta" size="xs" dot>
                    {wp.status}
                  </Badge>
                </div>
                <p className="text-xs text-[#8C7E72] mt-0.5">
                  Success Rate: <strong className="text-[#D97757]">{wp.successRate}%</strong>
                </p>
              </div>

              <div className="flex flex-col items-center justify-center bg-[#1C1C1C] text-white px-3 py-1 rounded-xl shrink-0">
                <span className="text-sm font-bold font-mono leading-none">
                  {wp.score}/10
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#98D8B0] font-semibold mt-0.5">
                  Score
                </span>
              </div>
            </div>

            {/* Evidence Callout */}
            <div className="p-3 bg-[#FCE8E1]/60 border border-[#D97757]/30 rounded-xl text-xs text-[#D97757] space-y-1">
              <span className="font-semibold block flex items-center gap-1.5">
                <span>⚠️</span> Summary:
              </span>
              <p className="text-[11px] leading-relaxed text-[#5C4033]">
                {wp.evidence}
              </p>
            </div>

            {/* Top Recurring Mistakes */}
            {wp.topMistakes && wp.topMistakes.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#8C7E72] uppercase tracking-wider block">
                  Recurring Mistake Categories:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {wp.topMistakes.map((m, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#1C1C1C]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
                      <span className="font-medium">{m.category}</span>
                      <span className="font-mono text-[#D97757] font-bold">({m.count}x)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisite Knowledge */}
            {wp.rootCauseCandidates && wp.rootCauseCandidates.length > 0 && (
              <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-xs space-y-1">
                <span className="text-[#8C7E72] font-semibold block uppercase text-[10px] tracking-wider">
                  Prerequisite Knowledge:
                </span>
                {wp.rootCauseCandidates.map((rc, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="text-xs text-[#5C4033]">
                      Prerequisite: <strong className="text-[#1C1C1C]">{rc.prerequisiteName}</strong>
                    </span>
                    <Badge
                      variant={rc.prerequisiteStatus === 'Stable' ? 'mint' : 'terracotta'}
                      size="xs"
                    >
                      {rc.prerequisiteStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Recommended Action & CTA */}
            {wp.recommendedAction && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E8E2D8]/70">
                <p className="text-xs text-[#5C4033] leading-relaxed flex-1">
                  💡 <span className="font-semibold text-[#1C1C1C]">Suggested Action:</span>{' '}
                  {wp.recommendedAction}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenLogAttempt(wp.patternId)}
                  className="shrink-0 text-xs"
                >
                  + Log Attempt
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
