import { useState } from 'react'
import Button from '../components/ui/Button'
import { setActiveUserId } from '../services/api/client'

export default function LoginView({
  currentUser = 'demo-user',
  onSelectUser = () => {},
  onClose = () => {},
}) {
  const [inputUser, setInputUser] = useState(currentUser)

  const quickUsers = ['demo-user', 'mouni-dev', 'ranjitha-dev', 'harini-dev']

  const handleSave = (userId) => {
    const finalId = userId.trim() || 'demo-user'
    setActiveUserId(finalId)
    onSelectUser(finalId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1C1C1C]">
              Switch Active User
            </h3>
            <p className="text-xs text-[#8C7E72] mt-0.5">
              Isolated user tenant for attempts & mastery
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C7E72] hover:text-[#1C1C1C] text-sm p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#5C4033]">
            User Identifier (x-user-id)
          </label>
          <input
            type="text"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
            className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl px-3 py-2 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#98D8B0]"
            placeholder="e.g. demo-user"
          />
        </div>

        {/* Quick User Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-[#8C7E72] font-medium block">
            Quick Profiles:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickUsers.map((u) => (
              <button
                key={u}
                onClick={() => {
                  setInputUser(u)
                  handleSave(u)
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  inputUser === u
                    ? 'bg-[#98D8B0] text-[#1C1C1C] border-[#98D8B0] font-semibold'
                    : 'bg-[#FAF7F2] text-[#5C4033] border-[#E8E2D8] hover:border-[#57B2A0]'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave(inputUser)}
          >
            Apply & Reload
          </Button>
        </div>
      </div>
    </div>
  )
}
