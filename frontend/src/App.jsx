import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import LoginView from './views/LoginView'
import GraphView from './views/GraphView'

export default function App() {
  const [activeTab, setActiveTab] = useState('graph') // 'graph' | 'pulse' | 'planner'
  const [user, setUser] = useState(() => localStorage.getItem('recallgraph_user_id') || 'demo-user')
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F0E8] text-[#1C1C1C]">
      {/* Left Navigation Rail (Member A) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <Header user={user} onOpenLogin={() => setShowLogin(true)} />

        {/* Tab View Container */}
        <main className="flex-1 overflow-hidden p-4 min-w-0">
          {activeTab === 'graph' && <GraphView key={user} />}
          {activeTab === 'pulse' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#5C4033] bg-white border border-[#E8E2D8] rounded-2xl shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center mb-3 text-2xl">
                ⚡
              </div>
              <h3 className="text-base font-bold text-[#1C1C1C]">Pattern Pulse Analytics</h3>
              <p className="text-xs text-[#8C7E72] mt-1 max-w-sm">
                Velocity metrics and LeetCode attempt recording logging interface (Coming in Step 3 & 4).
              </p>
            </div>
          )}
          {activeTab === 'planner' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#5C4033] bg-white border border-[#E8E2D8] rounded-2xl shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center mb-3 text-2xl">
                📋
              </div>
              <h3 className="text-base font-bold text-[#1C1C1C]">AI Revision Planner</h3>
              <p className="text-xs text-[#8C7E72] mt-1 max-w-sm">
                Active recall schedule, spaced repetition checkpoints, and targeted repair drills (Coming in Step 5).
              </p>
            </div>
          )}
        </main>
      </div>

      {/* User Switcher / Login Modal */}
      {showLogin && (
        <LoginView
          currentUser={user}
          onSelectUser={(newUser) => {
            setUser(newUser)
            setShowLogin(false)
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  )
}
