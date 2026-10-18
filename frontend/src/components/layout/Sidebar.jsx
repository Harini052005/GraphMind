export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    {
      id: 'graph',
      label: 'Memory Graph',
      description: 'Concept dependencies & mastery',
      badge: 'Step 2',
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          />
        </svg>
      ),
    },
    {
      id: 'pulse',
      label: 'Pattern Pulse',
      description: 'Mistake clusters & analytics',
      badge: 'Step 4',
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: 'planner',
      label: 'Revision Planner',
      description: 'Targeted procedural checklists',
      badge: 'Step 5',
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
  ]

  return (
    <aside className="w-64 bg-[#FAF7F2] border-r border-[#E8E2D8] flex flex-col justify-between shrink-0 select-none">
      {/* Upper Navigation Section */}
      <div className="p-4 space-y-6">
        {/* App Logo Emblem */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#57B2A0] text-white flex items-center justify-center shadow-xs">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="6" cy="6" r="3" strokeWidth="1.8" />
              <circle cx="18" cy="8" r="3" strokeWidth="1.8" />
              <circle cx="12" cy="18" r="3" strokeWidth="1.8" />
              <path strokeWidth="1.8" d="M8.5 7.5l7 1.5M7 8.8l4 6.4M16.8 10.5l-3.6 5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#1C1C1C] leading-none">
              GraphMind
            </span>
            <span className="text-[11px] text-[#8C7E72] mt-0.5">
              Knowledge Engine
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          <div className="px-2.5 pb-1 text-[11px] font-semibold text-[#8C7E72] uppercase tracking-wider">
            Workspace
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1C1C1C] border border-[#E8E2D8] shadow-xs'
                    : 'text-[#5C4033] hover:text-[#1C1C1C] hover:bg-white/60 border border-transparent'
                }`}
              >
                <div
                  className={`p-1 rounded-lg ${
                    isActive
                      ? 'bg-[#98D8B0]/25 text-[#1C5248]'
                      : 'text-[#8C7E72]'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-sm leading-tight truncate ${
                        isActive ? 'font-semibold text-[#1C1C1C]' : 'font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium shrink-0 ${
                        isActive
                          ? 'bg-[#98D8B0] text-[#1C1C1C]'
                          : 'bg-[#E8E2D8]/70 text-[#8C7E72]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8C7E72] truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Info Card */}
      <div className="p-4 border-t border-[#E8E2D8]/70">
        <div className="p-3 bg-white rounded-xl border border-[#E8E2D8] shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1C1C]">
            <span className="w-2 h-2 rounded-full bg-[#57B2A0]" />
            <span>FalkorDB Graph</span>
          </div>
          <p className="text-[11px] text-[#8C7E72] mt-1 leading-relaxed">
            Connected to graph: <span className="font-mono text-[#5C4033]">leetcode_mastery</span>
          </p>
        </div>
      </div>
    </aside>
  )
}
