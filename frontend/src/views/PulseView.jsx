import { useState, useEffect } from 'react'
import { fetchAnalytics } from '../services/api/analyticsApi'
import MetricOverviewCards from '../components/pulse/MetricOverviewCards'
import WeakPatternsCard from '../components/pulse/WeakPatternsCard'
import MistakeLeaderboard from '../components/pulse/MistakeLeaderboard'
import PatternMasteryTable from '../components/pulse/PatternMasteryTable'
import AttemptHistoryList from '../components/attempts/AttemptHistoryList'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function PulseView({
  onOpenLogModal = () => {},
  refreshTrigger = 0,
}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    let isMounted = true
    fetchAnalytics()
      .then((res) => {
        if (isMounted) {
          setData(res)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load analytics dashboard')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [refreshTrigger])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      const res = await fetchAnalytics()
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to load analytics dashboard')
    } finally {
      setIsRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 text-[#5C4033]">
        <div className="w-8 h-8 rounded-full border-2 border-[#57B2A0] border-t-transparent animate-spin" />
        <span className="text-sm font-medium">Computing learning diagnostics & mistake clusters...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
        <div className="p-4 bg-[#FCE8E1] text-[#D97757] rounded-xl text-sm font-medium border border-[#D97757]/30 max-w-md">
          {error || 'Unable to retrieve learning analytics'}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleManualRefresh}
        >
          Retry Analytics Sync
        </Button>
      </div>
    )
  }

  const {
    overview = {},
    weakPatterns = [],
    patternMastery = [],
    repeatedMistakesLeaderboard = [],
  } = data

  return (
    <div className="space-y-6 pb-12">
      {/* Top Pulse Banner & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-[#E8E2D8] rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[#1C1C1C] tracking-tight">
              Pattern Pulse & Learning Analytics
            </h2>
            <Badge variant="mint" size="xs">
              Live Diagnostics
            </Badge>
            <Badge variant="sage" size="xs">
              Phase 4 Active
            </Badge>
          </div>
          <p className="text-xs text-[#5C4033] mt-1">
            Grounded cognitive diagnostics derived from your LeetCode practice and error history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            <span className={`text-xs ${isRefreshing ? 'animate-spin' : ''}`}>
              🔄
            </span>
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Pulse'}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenLogModal()}
          >
            <span className="text-base leading-none mr-0.5">+</span> Log Attempt
          </Button>
        </div>
      </div>

      {/* 1. Top Row: 4 Metric Overview Cards */}
      <MetricOverviewCards overview={overview} />

      {/* 2. Middle Row: Two Columns (Weak Patterns Alert + Mistake Leaderboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Weak Patterns Alert */}
        <WeakPatternsCard
          weakPatterns={weakPatterns}
          onOpenLogAttempt={() => onOpenLogModal()}
        />

        {/* Right Column: Repeated Mistakes Leaderboard */}
        <MistakeLeaderboard mistakes={repeatedMistakesLeaderboard} />
      </div>

      {/* 3. Bottom Full-Width: Pattern Mastery Diagnostic Table */}
      <PatternMasteryTable patternMastery={patternMastery} />

      {/* 4. Live Practice Attempt History Feed */}
      <div className="pt-2">
        <AttemptHistoryList
          onOpenLogModal={onOpenLogModal}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  )
}
