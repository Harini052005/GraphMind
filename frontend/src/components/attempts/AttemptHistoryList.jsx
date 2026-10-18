import { useState, useEffect } from 'react'
import {
  fetchUserAttempts,
  DSA_PATTERNS,
} from '../../services/api/attemptsApi'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function AttemptHistoryList({
  onOpenLogModal,
  refreshTrigger = 0,
}) {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterPattern, setFilterPattern] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [filterResult, setFilterResult] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const data = await fetchUserAttempts({
          patternId: filterPattern || undefined,
          difficulty: filterDifficulty || undefined,
          result: filterResult || undefined,
        })
        if (!isMounted) return
        setAttempts(data || [])
      } catch (err) {
        console.error('Failed to load attempts', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [filterPattern, filterDifficulty, filterResult, refreshTrigger])

  const solvedCount = attempts.filter((a) => a.result === 'Solved').length
  const failedCount = attempts.filter((a) => a.result === 'Failed').length

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

  function getPatternLabel(id) {
    return DSA_PATTERNS.find((p) => p.id === id)?.label || id
  }

  return (
    <div className="space-y-4">
      {/* Top Filter & Summary Header */}
      <Card className="p-4 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-[#1C1C1C]">
              Practice History
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-semibold text-[#5C4033]">
              {attempts.length} {attempts.length === 1 ? 'Attempt' : 'Attempts'}
            </span>
            {attempts.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="text-[#164332] font-medium">
                  {solvedCount} Solved
                </span>
                <span className="text-[#8C7E72]">•</span>
                <span className="text-[#B85333] font-medium">
                  {failedCount} Failed
                </span>
              </div>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Pattern Filter */}
            <select
              value={filterPattern}
              onChange={(e) => {
                setLoading(true)
                setFilterPattern(e.target.value)
              }}
              className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-xs text-[#1C1C1C] outline-none focus:border-[#57B2A0] cursor-pointer"
            >
              <option value="">All Patterns</option>
              {DSA_PATTERNS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={filterDifficulty}
              onChange={(e) => {
                setLoading(true)
                setFilterDifficulty(e.target.value)
              }}
              className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-xs text-[#1C1C1C] outline-none focus:border-[#57B2A0] cursor-pointer"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Result Filter */}
            <select
              value={filterResult}
              onChange={(e) => {
                setLoading(true)
                setFilterResult(e.target.value)
              }}
              className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-xs text-[#1C1C1C] outline-none focus:border-[#57B2A0] cursor-pointer"
            >
              <option value="">All Results</option>
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Failed">Failed</option>
            </select>

            {onOpenLogModal && (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenLogModal}
                className="ml-auto"
              >
                + Log Attempt
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Attempts List */}
      {loading ? (
        <div className="p-8 text-center bg-white border border-[#E8E2D8] rounded-2xl">
          <p className="text-xs text-[#8C7E72]">Loading practice records...</p>
        </div>
      ) : attempts.length === 0 ? (
        <Card className="p-10 text-center bg-[#FAF7F2]">
          <div className="max-w-sm mx-auto space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E2D8] flex items-center justify-center mx-auto text-[#8C7E72]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-[#1C1C1C]">
              No Practice Attempts Found
            </h4>
            <p className="text-xs text-[#8C7E72] leading-relaxed">
              {filterPattern || filterDifficulty || filterResult
                ? 'No attempts match the selected filter combination.'
                : 'Start recording your LeetCode practice to build your persistent memory graph.'}
            </p>
            {onOpenLogModal && (
              <div className="pt-2">
                <Button variant="primary" size="sm" onClick={onOpenLogModal}>
                  Log Your First Attempt
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => {
            const isExpanded = expandedId === attempt.id
            const hasExtra = attempt.notes || attempt.codeSnippet

            return (
              <Card
                key={attempt.id}
                className="p-4 transition-all hover:border-[#57B2A0]/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Problem info & badges */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1C1C1C] truncate">
                        {attempt.problemTitle}
                      </h4>

                      {attempt.leetcodeUrl && (
                        <a
                          href={attempt.leetcodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#57B2A0] hover:text-[#1C5248] transition-colors shrink-0"
                          title="Open LeetCode link"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}

                      <Badge
                        variant={
                          attempt.result === 'Solved'
                            ? 'mint'
                            : attempt.result === 'Failed'
                              ? 'terracotta'
                              : 'sage'
                        }
                        size="xs"
                        dot
                      >
                        {attempt.result}
                      </Badge>

                      <Badge
                        variant={
                          attempt.difficulty === 'Easy'
                            ? 'mint'
                            : attempt.difficulty === 'Hard'
                              ? 'terracotta'
                              : 'neutral'
                        }
                        size="xs"
                      >
                        {attempt.difficulty}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#8C7E72]">
                      <span className="font-medium text-[#5C4033]">
                        {getPatternLabel(attempt.patternId)}
                      </span>
                      <span>•</span>
                      <span>{attempt.timeTakenMinutes} mins</span>
                      {attempt.createdAt && (
                        <>
                          <span>•</span>
                          <span>{formatDate(attempt.createdAt)}</span>
                        </>
                      )}
                      {attempt.mistakeCategory && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#FCE8E1] text-[#B85333] border border-[#D97757]/30 text-[11px] font-semibold">
                            {attempt.mistakeCategory}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Expand / Accordion trigger */}
                  {hasExtra && (
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : attempt.id)}
                      className="text-xs font-semibold text-[#57B2A0] hover:text-[#1C5248] shrink-0 self-start sm:self-center transition-colors cursor-pointer"
                    >
                      {isExpanded ? 'Hide Details ▲' : 'View Notes ▼'}
                    </button>
                  )}
                </div>

                {/* Expandable Notes & Code Snippet */}
                {isExpanded && (
                  <div className="mt-3.5 pt-3 border-t border-[#E8E2D8] space-y-2.5 text-xs animate-in fade-in duration-150">
                    {attempt.notes && (
                      <div className="space-y-1">
                        <span className="font-semibold text-[#5C4033] uppercase text-[10px] tracking-wider">
                          Reflection Notes
                        </span>
                        <p className="text-[#1C1C1C] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E2D8] leading-relaxed whitespace-pre-wrap">
                          {attempt.notes}
                        </p>
                      </div>
                    )}

                    {attempt.codeSnippet && (
                      <div className="space-y-1">
                        <span className="font-semibold text-[#5C4033] uppercase text-[10px] tracking-wider">
                          Code Snippet
                        </span>
                        <pre className="text-[#1C1C1C] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E2D8] font-mono text-[11px] overflow-x-auto">
                          <code>{attempt.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
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
