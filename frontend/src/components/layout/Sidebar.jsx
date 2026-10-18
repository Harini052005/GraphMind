export default function Sidebar({
  activeTab = 'graph',
  setActiveTab = () => {},
}) {
  const navItems = [
    {
      id: 'graph',
      label: 'Memory Graph',
      description: 'Cognitive DSA map & concepts',
      badge: 'Step 2',
      icon: (
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M8.5 7.5L15.5 16.5M8.5 6h7M18 8.5v7" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'pulse',
      label: 'Pattern Pulse',
      description: 'Mistake clusters & analytics',
      badge: 'Step 3/4',
      icon: (
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: 'planner',
      label: 'Revision Planner',
      description: 'AI-generated targeted drills',
      badge: 'Step 5',
      icon: (
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-[#E8E2D8] flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#E8E2D8] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-white font-bold text-base shadow-xs">
            <span className="text-[#98D8B0]">G</span>M
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#1C1C1C] leading-none tracking-tight">
              GraphMind
            </h1>
            <span className="text-[10px] text-[#8C7E72] font-medium tracking-wider uppercase mt-1 block">
              RecallGraph AI
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 overflow-y-auto" aria-label="Workspace Navigation">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-[#8C7E72] uppercase tracking-wider">
            Workspace Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#FAF7F2] text-[#1C1C1C] font-semibold border border-[#E8E2D8] shadow-2xs'
                    : 'text-[#5C4033] hover:bg-[#FAF7F2] hover:text-[#1C1C1C] font-medium'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#98D8B0] text-[#1C1C1C]'
                      : 'bg-[#FAF7F2] text-[#5C4033]'
                  }`}
                >
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FAF7F2] border border-[#E8E2D8] text-[#8C7E72] font-mono">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#8C7E72] truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#E8E2D8] bg-[#FAF7F2]/40 text-xs text-[#8C7E72]">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-semibold text-[#5C4033]">Knowledge Engine</span>
          <span className="text-[#57B2A0] font-mono">v1.0</span>
        </div>
        <p className="text-[10px] leading-relaxed">
          Connected to FalkorDB <span className="font-mono text-[#5C4033]">leetcode_mastery</span>.
        </p>
      </div>
    </aside>
  )
}
