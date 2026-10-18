import { useState, useMemo } from 'react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function PatternMasteryTable({
  patternMastery = [],
}) {
  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatterns = useMemo(() => {
    return patternMastery.filter((p) => {
      const matchesFilter =
        filter === 'ALL'
          ? true
          : filter === 'Needs Revision'
          ? p.status === 'Needs Revision' || p.status === 'Critical'
          : p.status === filter

      const matchesSearch =
        searchTerm.trim() === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesFilter && matchesSearch
    })
  }, [patternMastery, filter, searchTerm])

  return (
    <Card className="bg-white shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#1C1C1C] uppercase tracking-wider flex items-center gap-2">
            <span>Pattern Mastery</span>
            <span className="text-xs font-mono font-normal text-[#8C7E72]">
              ({filteredPatterns.length} of {patternMastery.length} patterns)
            </span>
          </h3>
          <p className="text-xs text-[#8C7E72] mt-0.5">
            Mastery scores calculated from your solve rates and mistake frequency
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter pattern..."
              className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl pl-7 pr-3 py-1.5 text-[#1C1C1C] placeholder-[#8C7E72] focus:outline-none focus:ring-2 focus:ring-[#98D8B0] w-36 sm:w-44"
            />
            <span className="absolute left-2.5 top-1.5 text-[#8C7E72] text-xs">
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1.5 text-[#8C7E72] hover:text-[#1C1C1C] text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-[#FAF7F2] border border-[#E8E2D8] p-0.5 rounded-xl text-[11px]">
            {['ALL', 'Stable', 'Needs Revision', 'Unpracticed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filter === f
                    ? 'bg-white text-[#1C1C1C] shadow-2xs font-semibold'
                    : 'text-[#8C7E72] hover:text-[#1C1C1C]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] text-[#8C7E72] font-semibold border-b border-[#E8E2D8] uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-5">Pattern / Category</th>
              <th className="py-3 px-4">Mastery Score</th>
              <th className="py-3 px-4">Attempts / Solved</th>
              <th className="py-3 px-4">Success Rate</th>
              <th className="py-3 px-4">Avg Speed</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5">Performance Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D8]">
            {filteredPatterns.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#8C7E72]">
                  No patterns match the selected filter.
                </td>
              </tr>
            ) : (
              filteredPatterns.map((p) => {
                const metrics = p.metrics || {}
                const attempts = metrics.totalAttempts || 0
                const solved = metrics.solvedCount || 0
                const successRate = metrics.successRate || 0
                const avgTime = metrics.avgTimeTakenMinutes || 0

                const statusVariant = {
                  Stable: 'mint',
                  'Needs Revision': 'terracotta',
                  Critical: 'terracotta',
                  Unpracticed: 'neutral',
                }[p.status] || 'neutral'

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-[#FAF7F2]/60 transition-colors"
                  >
                    {/* Pattern Name & Category */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#1C1C1C] text-sm">
                        {p.name}
                      </div>
                      <span className="text-[10px] text-[#8C7E72] uppercase tracking-wider">
                        {p.category || 'DSA Pattern'}
                      </span>
                    </td>

                    {/* Mastery Score Badge */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1C1C1C] text-white font-mono font-bold text-xs shadow-2xs">
                        <span>{p.score}</span>
                        <span className="text-[#98D8B0] text-[9px] font-normal">/ 10</span>
                      </div>
                    </td>

                    {/* Attempts & Solved */}
                    <td className="py-3.5 px-4 text-[#5C4033] font-mono">
                      {attempts > 0 ? (
                        <span>
                          <strong className="text-[#18533b]">{solved}</strong> / {attempts}
                        </span>
                      ) : (
                        <span className="text-[#8C7E72] italic">0 attempts</span>
                      )}
                    </td>

                    {/* Success Rate Meter */}
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#FAF7F2] border border-[#E8E2D8] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              successRate >= 70
                                ? 'bg-[#57B2A0]'
                                : successRate >= 50
                                ? 'bg-[#98D8B0]'
                                : 'bg-[#D97757]'
                            }`}
                            style={{ width: `${Math.max(successRate, attempts > 0 ? 4 : 0)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono font-semibold text-[#1C1C1C] w-9 text-right">
                          {successRate}%
                        </span>
                      </div>
                    </td>

                    {/* Avg Time */}
                    <td className="py-3.5 px-4 text-[#8C7E72] font-mono">
                      {avgTime > 0 ? `${avgTime} min` : '—'}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      <Badge variant={statusVariant} size="xs" dot>
                        {p.status}
                      </Badge>
                    </td>

                    {/* Diagnostic Evidence */}
                    <td className="py-3.5 px-5 text-[#5C4033] max-w-xs text-[11px] leading-relaxed">
                      {p.evidence || 'No evidence recorded.'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
