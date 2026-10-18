import { useState } from 'react'
import { setActiveUserId } from '../services/api/client'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const PRESET_USERS = [
  { id: 'demo-user', role: 'Default Test Account' },
  { id: 'harini-dev', role: 'Frontend Engineer' },
  { id: 'mouni-dev', role: 'Frontend Engineer' },
  { id: 'ranjitha-dev', role: 'Backend Engineer' },
  { id: 'alex_coder', role: 'DSA Candidate' },
  { id: 'leetcode_pro', role: 'Pattern Master' },
]

export default function LoginView({
  currentUser = 'demo-user',
  onSelectUser = () => {},
  onClose = () => {},
}) {
  const [customUserId, setCustomUserId] = useState(currentUser || 'demo-user')
  const [error, setError] = useState('')

  function handleSave(selectedId) {
    const trimmed = (selectedId || customUserId).trim()
    if (!trimmed) {
      setError('Please provide a valid User ID')
      return
    }

    setActiveUserId(trimmed)
    onSelectUser(trimmed)
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    handleSave(customUserId)
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="User Identity Switcher"
      subtitle="Isolated user tenant for attempts, graph mastery & revisions"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Current Active User Info */}
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#57B2A0] text-white text-xs font-bold flex items-center justify-center">
              {currentUser?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1C1C1C]">
                Active Profile
              </p>
              <p className="text-xs font-mono text-[#5C4033]">{currentUser}</p>
            </div>
          </div>
          <Badge variant="mint" size="xs" dot>
            Current
          </Badge>
        </div>

        {/* Custom User ID Input */}
        <Input
          label="Custom User ID / Handle"
          id="user-id-input"
          placeholder="e.g. harini-dev"
          value={customUserId}
          onChange={(e) => {
            setCustomUserId(e.target.value)
            if (error) setError('')
          }}
          error={error}
          helperText="All attempts, revisions, and graph history are keyed to this User ID."
          autoFocus
        />

        {/* Quick-Select Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider">
            Quick Select Profiles
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_USERS.map((preset) => {
              const isSelected =
                customUserId.trim().toLowerCase() === preset.id.toLowerCase()

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setCustomUserId(preset.id)
                    setError('')
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF7F2] border-[#57B2A0] ring-1 ring-[#57B2A0]'
                      : 'bg-white border-[#E8E2D8] hover:border-[#57B2A0]/50 hover:bg-[#FAF7F2]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1C1C] truncate">
                      {preset.id}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#57B2A0]" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#8C7E72] block truncate mt-0.5">
                    {preset.role}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8E2D8]/70">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Apply & Switch
          </Button>
        </div>
      </form>
    </Modal>
  )
}
