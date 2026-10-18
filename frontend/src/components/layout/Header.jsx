import { useState, useEffect } from 'react'
import { checkBackendHealth } from '../../services/api/client'
import StatusIndicator from '../ui/StatusIndicator'

export default function Header({ user, onOpenLogin }) {
  const [healthStatus, setHealthStatus] = useState('loading')
  const [healthDetails, setHealthDetails] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function verifyHealth() {
      try {
        const data = await checkBackendHealth()
        if (!isMounted) return

        if (data?.status === 'ok') {
          setHealthStatus('ok')
          setHealthDetails(data)
        } else {
          setHealthStatus('degraded')
          setHealthDetails(data)
        }
      } catch {
        if (!isMounted) return
        setHealthStatus('offline')
        setHealthDetails(null)
      }
    }

    verifyHealth()
    const interval = setInterval(verifyHealth, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  // Get user avatar initials
  const initials =
    (user || 'DU')
      .split(/[-_ ]/)
      .map((part) => part[0]?.toUpperCase() || '')
      .slice(0, 2)
      .join('') || 'U'

  return (
    <header className="h-16 px-6 bg-white border-b border-[#E8E2D8] flex items-center justify-between shrink-0 shadow-2xs">
      {/* Left: Branding & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#1C1C1C] tracking-tight">
              RecallGraph <span className="text-[#57B2A0]">AI</span>
            </h1>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#FAF7F2] text-[#8C7E72] border border-[#E8E2D8]">
              v1.0
            </span>
          </div>
          <p className="text-xs text-[#8C7E72] hidden sm:block">
            Your coding history. Your next breakthrough.
          </p>
        </div>
      </div>

      {/* Right: Backend Connection Status & User Profile Switcher */}
      <div className="flex items-center gap-3.5">
        {/* Backend Connectivity Status */}
        <div
          title={
            healthDetails?.falkordb?.graph
              ? `FalkorDB: ${healthDetails.falkordb.graph} | LLM: ${healthDetails?.llm?.configured ? 'Active' : 'Fallback'}`
              : 'Backend connection state'
          }
        >
          <StatusIndicator
            status={healthStatus}
            label={
              healthStatus === 'ok'
                ? 'Backend Connected'
                : healthStatus === 'loading'
                  ? 'Checking Server...'
                  : 'Offline / Degraded Mode'
            }
          />
        </div>

        <div className="h-4 w-px bg-[#E8E2D8]" />

        {/* User Profile Pill */}
        <button
          type="button"
          onClick={onOpenLogin}
          className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#57B2A0] hover:bg-white transition-all duration-150 cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#98D8B0]"
          aria-label="Switch active user"
        >
          <div className="w-7 h-7 rounded-full bg-[#57B2A0] text-white text-xs font-semibold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-[#1C1C1C] group-hover:text-[#57B2A0] transition-colors leading-tight">
              {user}
            </span>
            <span className="text-[10px] text-[#8C7E72] leading-tight">
              Switch user
            </span>
          </div>
          <svg
            className="w-3.5 h-3.5 text-[#8C7E72] group-hover:text-[#1C1C1C] transition-colors ml-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
