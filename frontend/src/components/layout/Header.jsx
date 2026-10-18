import StatusIndicator from '../ui/StatusIndicator'
import { useBackendHealth } from '../../hooks/useBackendHealth'

export default function Header({
  user = 'demo-user',
  onOpenLogin = () => {},
}) {
  const health = useBackendHealth(15000)

  return (
    <header className="h-16 bg-white border-b border-[#E8E2D8] px-6 flex items-center justify-between shrink-0 select-none shadow-2xs">
      {/* Title & Tagline */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-[#1C1C1C] tracking-tight">
          DSA Memory Graph
        </h2>
        <span className="hidden sm:inline-block text-xs text-[#8C7E72] pl-3 border-l border-[#E8E2D8]">
          Your coding history. Your next breakthrough.
        </span>
      </div>

      {/* Right Controls: Backend Health & User Switcher */}
      <div className="flex items-center gap-3">
        {/* Backend Connection Indicator */}
        <StatusIndicator
          status={health.status}
          label={
            health.status === 'ok'
              ? health.falkordb?.connected
                ? 'FalkorDB Graph Live'
                : 'In-Memory Store Active'
              : 'Offline / Mock Mode'
          }
        />

        {/* User Switcher Pill */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#57B2A0] transition-colors cursor-pointer text-xs"
        >
          <div className="w-5 h-5 rounded-full bg-[#57B2A0] text-white flex items-center justify-center font-bold text-[10px]">
            {user.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-[#1C1C1C] max-w-[100px] truncate">
            {user}
          </span>
          <span className="text-[10px] text-[#8C7E72]">▾</span>
        </button>
      </div>
    </header>
  )
}
