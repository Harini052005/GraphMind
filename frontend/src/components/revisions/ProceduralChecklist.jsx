import { useState, useId } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import { completeRevision } from '../../services/api/revisionsApi'

export default function ProceduralChecklist({
  task,
  onCompleted = () => {},
  onOpenLogModal = () => {},
}) {
  const [checkedSteps, setCheckedSteps] = useState({})
  const [showReflectionModal, setShowReflectionModal] = useState(false)
  const [reflectionNotes, setReflectionNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const reflectionTextareaId = useId()

  const checklistItems =
    task?.checklist ||
    task?.actionableTask?.proceduralChecklist ||
    []

  const patternName =
    task?.patternName ||
    task?.targetPatternName ||
    'Target Pattern'

  const totalSteps = checklistItems.length
  const completedCount = checklistItems.filter((_, idx) => checkedSteps[idx]).length
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0

  function toggleStep(idx) {
    setCheckedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  async function handleCompleteSubmit(e) {
    e.preventDefault()
    if (!task?.id) {
      // If task came directly from agent recommendation without an id yet, close modal
      setShowReflectionModal(false)
      onCompleted()
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await completeRevision(task.id, reflectionNotes.trim())
      setShowReflectionModal(false)
      setReflectionNotes('')
      onCompleted()
    } catch (err) {
      setError(err?.message || 'Failed to complete revision task.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card className="p-6 bg-white border border-[#E8E2D8] shadow-xs space-y-4">
        {/* Header & Progress Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D8]/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1C1C1C]">
                Procedural Repair Checklist
              </h3>
              <Badge variant="sage" size="xs">
                {patternName}
              </Badge>
            </div>
            <p className="text-xs text-[#5C4033] mt-0.5">
              Step-by-step cognitive guardrails to eliminate repeated mistakes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#1C1C1C]">
              {completedCount} / {totalSteps} Steps ({progressPercent}%)
            </span>
            <div className="w-24 h-2 bg-[#FAF7F2] border border-[#E8E2D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#57B2A0] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist Steps */}
        {checklistItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8C7E72] bg-[#FAF7F2] rounded-xl border border-[#E8E2D8]">
            No checklist items available for this recommendation.
          </div>
        ) : (
          <div className="space-y-2.5">
            {checklistItems.map((step, idx) => {
              const isChecked = !!checkedSteps[idx]

              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-[#FAF7F2] border-[#57B2A0]/40 text-[#5C4033]'
                      : 'bg-white border-[#E8E2D8] hover:border-[#57B2A0]/50 hover:bg-[#FAF7F2]/50 text-[#1C1C1C]'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isChecked
                          ? 'bg-[#57B2A0] border-[#57B2A0] text-white'
                          : 'border-[#8C7E72] bg-white'
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs leading-relaxed select-none ${
                        isChecked ? 'line-through text-[#8C7E72]' : 'font-medium'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E2D8]/80">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenLogModal}
            className="text-xs"
          >
            + Log Practice Attempt for Drill
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowReflectionModal(true)}
            className="font-semibold shadow-xs"
          >
            Mark Revision Completed
          </Button>
        </div>
      </Card>

      {/* Reflection & Completion Modal */}
      {showReflectionModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowReflectionModal(false)}
          title="Complete Revision Drill"
          subtitle={`Record your reflection notes for ${patternName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCompleteSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-[#FCE8E1] border border-[#D97757]/40 rounded-xl text-xs text-[#B85333] font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor={reflectionTextareaId}
                className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
              >
                What did you learn from this revision?
              </label>
              <textarea
                id={reflectionTextareaId}
                rows="4"
                required
                placeholder="e.g. Mastered the duplicate-skipping while loop. Understood why sorting first is mandatory for Two Pointers."
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E8E2D8] rounded-xl text-xs text-[#1C1C1C] placeholder:text-[#8C7E72] outline-none focus:border-[#57B2A0] focus:ring-2 focus:ring-[#98D8B0]/30 transition-all resize-y"
                autoFocus
              />
              <p className="text-[11px] text-[#8C7E72]">
                Your reflections are stored in FalkorDB to track retention over time.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E8E2D8]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReflectionModal(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save & Mark Completed'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
