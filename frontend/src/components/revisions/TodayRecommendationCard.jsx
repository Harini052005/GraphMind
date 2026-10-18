import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function TodayRecommendationCard({
  recommendation,
  onRefresh = () => {},
  isRefreshing = false,
  onFocusTask = () => {},
}) {
  if (!recommendation) {
    return (
      <Card className="p-6 bg-white border border-[#E8E2D8]">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#8C7E72]">No recommendation loaded yet.</p>
          <Button variant="primary" size="sm" onClick={onRefresh} disabled={isRefreshing}>
            Run Agent Analysis
          </Button>
        </div>
      </Card>
    )
  }

  const isWeakPattern = recommendation.decision === 'REVISE_WEAK_PATTERN'
  const isAgentMode = recommendation.mode === 'llm-agent'

  return (
    <Card className="p-6 bg-white border border-[#E8E2D8] shadow-xs relative overflow-hidden">
      {/* Decorative Warm Top Edge */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isWeakPattern ? 'bg-[#D97757]' : 'bg-[#98D8B0]'
        }`}
      />

      <div className="space-y-4 pt-1">
        {/* Top Badges & Agent Mode */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Badge
              variant={isWeakPattern ? 'terracotta' : 'mint'}
              size="xs"
              dot
            >
              {isWeakPattern ? 'Priority Revision Required' : 'Explore Next Topic'}
            </Badge>

            {recommendation.targetPatternName && (
              <Badge variant="neutral" size="xs">
                {recommendation.targetPatternName}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono border ${
                isAgentMode
                  ? 'bg-[#57B2A0]/15 text-[#1C5248] border-[#57B2A0]/40'
                  : 'bg-[#FAF7F2] text-[#8C7E72] border-[#E8E2D8]'
              }`}
            >
              {isAgentMode ? '🤖 LLM Agent Reasoning' : '⚡ Deterministic Graph Engine'}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="text-xs py-1 h-7"
            >
              <span className={`text-xs ${isRefreshing ? 'animate-spin' : ''}`}>
                🔄
              </span>
              <span>{isRefreshing ? 'Thinking...' : 'Run Agent Analysis'}</span>
            </Button>
          </div>
        </div>

        {/* Headline & Reasoning */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-[#1C1C1C] tracking-tight">
            {recommendation.headline || 'Personalized DSA Revision Task'}
          </h2>
          <p className="text-sm text-[#5C4033] leading-relaxed">
            {recommendation.reasoning}
          </p>
        </div>

        {/* Grounded Evidence Chips */}
        {recommendation.evidence?.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="block text-[11px] font-semibold text-[#8C7E72] uppercase tracking-wider">
              Grounded Graph Evidence
            </span>
            <div className="flex flex-wrap gap-2">
              {recommendation.evidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-xs text-[#1C1C1C]"
                >
                  <span className="text-[#D97757] font-bold text-xs">•</span>
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actionable Problem Recommendation Callout */}
        {recommendation.actionableTask?.problemRecommendation && (
          <div className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="text-base leading-none mt-0.5">🎯</span>
              <div>
                <span className="text-xs font-bold text-[#1C1C1C] block">
                  Recommended Problem Objective
                </span>
                <p className="text-xs text-[#5C4033] mt-0.5">
                  {recommendation.actionableTask.problemRecommendation}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onFocusTask(recommendation)}
              className="shrink-0"
            >
              Start Checklist Drill
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
