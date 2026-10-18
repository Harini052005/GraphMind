import { useState, useEffect } from 'react'
import {
  fetchAgentRecommendation,
  fetchRevisions,
} from '../services/api/revisionsApi'
import TodayRecommendationCard from '../components/revisions/TodayRecommendationCard'
import ProceduralChecklist from '../components/revisions/ProceduralChecklist'
import RevisionHistoryList from '../components/revisions/RevisionHistoryList'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function PlannerView({
  onOpenLogModal = () => {},
  refreshTrigger = 0,
}) {
  const [recommendation, setRecommendation] = useState(null)
  const [revisions, setRevisions] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [loadingRec, setLoadingRec] = useState(true)
  const [loadingRevisions, setLoadingRevisions] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [rec, list] = await Promise.all([
          fetchAgentRecommendation(),
          fetchRevisions(),
        ])
        if (!isMounted) return
        setRecommendation(rec)
        setRevisions(list || [])
        const pending = list?.find((r) => r.status === 'PENDING')
        setSelectedTask(pending || rec)
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Failed to load planner data')
      } finally {
        if (isMounted) {
          setLoadingRec(false)
          setLoadingRevisions(false)
        }
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [refreshTrigger])

  const handleManualAgentRun = async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      const rec = await fetchAgentRecommendation()
      setRecommendation(rec)
      setSelectedTask(rec)
      const list = await fetchRevisions()
      setRevisions(list || [])
    } catch (err) {
      setError(err.message || 'Agent analysis failed')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleTaskCompleted = async () => {
    try {
      const list = await fetchRevisions()
      setRevisions(list || [])
    } catch (err) {
      console.warn('Failed to refresh revisions', err)
    }
  }

  const handleRefreshListOnly = async () => {
    try {
      const list = await fetchRevisions()
      setRevisions(list || [])
    } catch (err) {
      console.warn('Failed to refresh list', err)
    }
  }

  if (loadingRec && loadingRevisions) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 text-[#5C4033]">
        <div className="w-8 h-8 rounded-full border-2 border-[#57B2A0] border-t-transparent animate-spin" />
        <span className="text-sm font-medium">
          Synthesizing AI agent recommendations & procedural checklists...
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-[#E8E2D8] rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[#1C1C1C] tracking-tight">
              AI Revision Planner
            </h2>
            <Badge variant="mint" size="xs">
              Phase 5 & 6 Live
            </Badge>
            <Badge variant="sage" size="xs">
              Adaptive Drills
            </Badge>
          </div>
          <p className="text-xs text-[#5C4033] mt-1">
            LLM agent recommendations with grounded citations to eliminate your recurring error patterns.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualAgentRun}
            disabled={isRefreshing}
          >
            <span className={`text-xs ${isRefreshing ? 'animate-spin' : ''}`}>
              🤖
            </span>
            <span>{isRefreshing ? 'Thinking...' : 'Run Agent Analysis'}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenLogModal}
          >
            <span className="text-base leading-none mr-0.5">+</span> Log Attempt
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#FCE8E1] border border-[#D97757]/40 rounded-xl text-xs text-[#B85333] font-medium flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-[#D97757] hover:text-[#1C1C1C] font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Today's AI Agent Recommendation Hero */}
      <TodayRecommendationCard
        recommendation={recommendation}
        onRefresh={handleManualAgentRun}
        isRefreshing={isRefreshing}
        onFocusTask={(task) => setSelectedTask(task)}
      />

      {/* 2. Interactive Procedural Checklist */}
      <ProceduralChecklist
        task={selectedTask || recommendation}
        onCompleted={handleTaskCompleted}
        onOpenLogModal={onOpenLogModal}
      />

      {/* 3. Past Revision Tasks & Reflection History */}
      <RevisionHistoryList
        revisions={revisions}
        loading={loadingRevisions}
        onSelectRevision={(rev) => setSelectedTask(rev)}
        onRefresh={handleRefreshListOnly}
      />
    </div>
  )
}
