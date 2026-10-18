import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function MistakeLeaderboard({
  mistakes = [],
}) {
  const maxCount =
    mistakes.length > 0 ? Math.max(...mistakes.map((m) => m.count || 0)) : 1

  return (
    <Card className="p-5 bg-white shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
        <div>
          <h3 className="text-sm font-bold text-[#1C1C1C] uppercase tracking-wider flex items-center gap-2">
            <span>Recurring Mistake Leaderboard</span>
          </h3>
          <p className="text-xs text-[#8C7E72] mt-0.5">
            Clustered anti-patterns across your LeetCode attempts
          </p>
        </div>
        <Badge variant="terracotta" size="xs">
          {mistakes.length} Clusters
        </Badge>
      </div>

      {/* Mistake Items */}
      {mistakes.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#8C7E72]">
          No repeated mistake patterns recorded yet. Keep practicing!
        </div>
      ) : (
        <div className="space-y-3.5">
          {mistakes.map((item, index) => {
            const count = item.count || 0
            const percentage = Math.round((count / maxCount) * 100)

            return (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#57B2A0]/40 transition-colors space-y-2"
              >
                {/* Title & Frequency Count */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#1C1C1C] text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-[#1C1C1C]">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#D97757] bg-white border border-[#E8E2D8] px-2 py-0.5 rounded-md">
                    {count} {count === 1 ? 'occurrence' : 'occurrences'}
                  </span>
                </div>

                {/* Relative Frequency Bar */}
                <div className="w-full bg-white border border-[#E8E2D8] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      count >= 2 ? 'bg-[#D97757]' : 'bg-[#57B2A0]'
                    }`}
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  />
                </div>

                {/* Affected Pattern Tags */}
                {item.affectedPatterns && item.affectedPatterns.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-0.5 text-[11px]">
                    <span className="text-[#8C7E72] font-medium">Affects:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.affectedPatterns.map((patId, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2 py-0.5 rounded bg-white border border-[#E8E2D8] text-[10px] font-medium text-[#5C4033] capitalize"
                        >
                          {patId.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
