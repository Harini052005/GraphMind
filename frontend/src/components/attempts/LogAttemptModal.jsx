import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import {
  recordAttempt,
  DSA_PATTERNS,
  MISTAKE_CATEGORIES,
} from '../../services/api/attemptsApi'

export default function LogAttemptModal({ isOpen, onClose, onSuccess }) {
  const [problemTitle, setProblemTitle] = useState('')
  const [leetcodeUrl, setLeetcodeUrl] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [patternId, setPatternId] = useState('two-pointers')
  const [result, setResult] = useState('Solved')
  const [timeTakenMinutes, setTimeTakenMinutes] = useState(25)
  const [mistakeCategory, setMistakeCategory] = useState('')
  const [customMistake, setCustomMistake] = useState('')
  const [notes, setNotes] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [showCodeSnippet, setShowCodeSnippet] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successToast, setSuccessToast] = useState('')

  if (!isOpen) return null

  function resetForm() {
    setProblemTitle('')
    setLeetcodeUrl('')
    setDifficulty('Medium')
    setPatternId('two-pointers')
    setResult('Solved')
    setTimeTakenMinutes(25)
    setMistakeCategory('')
    setCustomMistake('')
    setNotes('')
    setCodeSnippet('')
    setShowCodeSnippet(false)
    setError('')
    setSuccessToast('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const titleTrimmed = problemTitle.trim()
    if (!titleTrimmed || titleTrimmed.length < 2) {
      setError('Problem Title is required (min 2 characters).')
      return
    }

    if (timeTakenMinutes < 1 || timeTakenMinutes > 300) {
      setError('Time taken must be between 1 and 300 minutes.')
      return
    }

    const payload = {
      problemTitle: titleTrimmed,
      difficulty,
      patternId,
      result,
      timeTakenMinutes: Number(timeTakenMinutes),
    }

    if (leetcodeUrl.trim()) {
      payload.leetcodeUrl = leetcodeUrl.trim()
    }

    if (result !== 'Solved') {
      const finalMistake =
        mistakeCategory === 'Other'
          ? customMistake.trim()
          : (mistakeCategory || customMistake.trim())

      if (finalMistake) {
        payload.mistakeCategory = finalMistake
      }
    }

    if (notes.trim()) {
      payload.notes = notes.trim()
    }

    if (codeSnippet.trim()) {
      payload.codeSnippet = codeSnippet.trim()
    }

    setSubmitting(true)
    try {
      const response = await recordAttempt(payload)
      setSuccessToast(response.message || 'Attempt logged successfully!')
      setTimeout(() => {
        resetForm()
        onSuccess?.(response.data)
        onClose?.()
      }, 700)
    } catch (err) {
      setError(err?.message || 'Failed to record attempt.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Practice Attempt"
      subtitle="Track your LeetCode practice, identify patterns, and record mistakes"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Success / Error Feedback Alerts */}
        {error && (
          <div className="p-3 bg-[#FCE8E1] border border-[#D97757]/40 rounded-xl text-xs text-[#B85333] font-medium flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              className="text-[#D97757] hover:text-[#1C1C1C] font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {successToast && (
          <div className="p-3 bg-[#98D8B0]/25 border border-[#98D8B0]/60 rounded-xl text-xs text-[#164332] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#57B2A0]" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Problem Title & URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label
              htmlFor="attempt-title"
              className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
            >
              Problem Title *
            </label>
            <input
              id="attempt-title"
              type="text"
              required
              placeholder="e.g. 3Sum or Trapping Rain Water"
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E8E2D8] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#8C7E72] outline-none focus:border-[#57B2A0] focus:ring-2 focus:ring-[#98D8B0]/30 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="attempt-url"
              className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
            >
              LeetCode URL (optional)
            </label>
            <input
              id="attempt-url"
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={leetcodeUrl}
              onChange={(e) => setLeetcodeUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E8E2D8] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#8C7E72] outline-none focus:border-[#57B2A0] focus:ring-2 focus:ring-[#98D8B0]/30 transition-all"
            />
          </div>
        </div>

        {/* Difficulty & Pattern Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Difficulty Selection */}
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider">
              Difficulty *
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Easy', activeClass: 'bg-[#98D8B0]/30 border-[#57B2A0] text-[#164332] font-semibold' },
                { label: 'Medium', activeClass: 'bg-[#FCE8E1] border-[#D97757] text-[#B85333] font-semibold' },
                { label: 'Hard', activeClass: 'bg-[#D97757]/20 border-[#D97757] text-[#8A2B14] font-semibold' },
              ].map((item) => {
                const isSelected = difficulty === item.label
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setDifficulty(item.label)}
                    className={`py-1.5 rounded-xl text-xs border text-center transition-all cursor-pointer ${
                      isSelected
                        ? item.activeClass
                        : 'bg-white border-[#E8E2D8] text-[#5C4033] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pattern Selector */}
          <div className="space-y-1.5">
            <label
              htmlFor="attempt-pattern"
              className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
            >
              DSA Pattern *
            </label>
            <select
              id="attempt-pattern"
              value={patternId}
              onChange={(e) => setPatternId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E8E2D8] rounded-xl text-sm text-[#1C1C1C] outline-none focus:border-[#57B2A0] focus:ring-2 focus:ring-[#98D8B0]/30 transition-all cursor-pointer"
            >
              {DSA_PATTERNS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result & Time Taken Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Result Buttons */}
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider">
              Attempt Result *
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Solved', label: 'Solved', active: 'bg-[#98D8B0]/30 border-[#57B2A0] text-[#164332]' },
                { id: 'Attempted', label: 'Attempted', active: 'bg-[#57B2A0]/20 border-[#57B2A0] text-[#1C5248]' },
                { id: 'Failed', label: 'Failed', active: 'bg-[#FCE8E1] border-[#D97757] text-[#B85333]' },
              ].map((item) => {
                const isSelected = result === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setResult(item.id)}
                    className={`py-1.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                      isSelected
                        ? item.active
                        : 'bg-white border-[#E8E2D8] text-[#5C4033] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time Taken */}
          <div className="space-y-1.5">
            <label
              htmlFor="attempt-time"
              className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
            >
              Time Taken (Minutes) *
            </label>
            <div className="flex items-center gap-2">
              <input
                id="attempt-time"
                type="number"
                min="1"
                max="300"
                value={timeTakenMinutes}
                onChange={(e) => setTimeTakenMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 px-3 py-2 bg-white border border-[#E8E2D8] rounded-xl text-sm text-[#1C1C1C] outline-none focus:border-[#57B2A0] focus:ring-2 focus:ring-[#98D8B0]/30 transition-all font-mono"
              />
              <div className="flex items-center gap-1.5">
                {[5, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTimeTakenMinutes((prev) => prev + mins)}
                    className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#57B2A0] rounded-lg text-xs font-semibold text-[#5C4033] hover:text-[#1C1C1C] transition-all cursor-pointer"
                  >
                    +{mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mistake Category (Only visible when Failed or Attempted) */}
        {result !== 'Solved' && (
          <div className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-semibold text-[#D97757] uppercase tracking-wider">
                Mistake / Confusion Category
              </span>
              <span className="text-[11px] text-[#8C7E72]">
                Used for weak pattern clustering
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {MISTAKE_CATEGORIES.map((cat) => {
                const isSelected = mistakeCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setMistakeCategory(isSelected ? '' : cat)
                      if (customMistake) setCustomMistake('')
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FCE8E1] border-[#D97757] text-[#B85333]'
                        : 'bg-white border-[#E8E2D8] text-[#5C4033] hover:border-[#D97757]/40'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            <input
              type="text"
              placeholder="Or enter a custom mistake description..."
              value={customMistake}
              onChange={(e) => {
                setCustomMistake(e.target.value)
                setMistakeCategory('')
              }}
              className="w-full mt-2 px-3 py-1.5 bg-white border border-[#E8E2D8] rounded-lg text-xs text-[#1C1C1C] placeholder:text-[#8C7E72] outline-none focus:border-[#57B2A0] transition-all"
            />
          </div>
        )}

        {/* Reflection Notes */}
        <div className="space-y-1">
          <label
            htmlFor="attempt-notes"
            className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
          >
            Reflection Notes
          </label>
          <textarea
            id="attempt-notes"
            rows="2"
            placeholder="What clicked? Where did you hesitate or confuse the invariant?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E8E2D8] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#8C7E72] outline-none focus:border-[#57B2A0] focus:ring-2 focus:ring-[#98D8B0]/30 transition-all resize-y"
          />
        </div>

        {/* Toggle Code Snippet */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowCodeSnippet(!showCodeSnippet)}
            className="text-xs font-semibold text-[#57B2A0] hover:text-[#1C5248] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{showCodeSnippet ? '▼ Hide Code Snippet' : '▶ Add Solution / Mistake Code Snippet (Optional)'}</span>
          </button>

          {showCodeSnippet && (
            <textarea
              rows="4"
              placeholder="// Paste your solution or bug snippet here..."
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F2] font-mono text-xs border border-[#E8E2D8] rounded-xl text-[#1C1C1C] placeholder:text-[#8C7E72] outline-none focus:border-[#57B2A0] focus:ring-2 focus:ring-[#98D8B0]/30 transition-all resize-y"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D8]/80">
          <Button variant="ghost" size="md" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={submitting}>
            {submitting ? 'Recording...' : 'Record Attempt in Graph'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
