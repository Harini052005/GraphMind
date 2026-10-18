import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import LoginView from './views/LoginView'
import GraphView from './views/GraphView'
import LogAttemptModal from './components/attempts/LogAttemptModal'
import AttemptHistoryList from './components/attempts/AttemptHistoryList'
import Card from './components/ui/Card'
import Badge from './components/ui/Badge'

export default function App() {
  const [activeTab, setActiveTab] = useState('graph') // 'graph' | 'pulse' | 'planner'
  const [user, setUser] = useState(
    () => localStorage.getItem('recallgraph_user_id') || 'demo-user'
  )
  const [showLogin, setShowLogin] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)
  const [attemptsRefreshTrigger, setAttemptsRefreshTrigger] = useState(0)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F0E8] text-[#1C1C1C]">
      {/* Left Navigation Rail (Member A) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">
        {/* Top Header (Member B) */}
        <Header
          user={user}
          onOpenLogin={() => setShowLogin(true)}
          onOpenLogAttempt={() => setShowLogModal(true)}
        />

        {/* Tab View Container */}
        <main className="flex-1 overflow-auto p-4 min-w-0">
          {activeTab === 'graph' && (
            <div className="h-full w-full">
              <GraphView key={user} />
            </div>
          )}

          {activeTab === 'pulse' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <Card className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[#1C1C1C]">
                        Pattern Pulse Analytics
                      </h2>
                      <Badge variant="mint" size="xs">
                        Practice Feed Live
                      </Badge>
                    </div>
                    <p className="text-xs text-[#5C4033] mt-0.5">
                      Problem attempts, mistake clusters, and velocity tracking.
                    </p>
                  </div>
                  <Badge variant="terracotta" size="sm">
                    Phase 4 Scorer Coming Next
                  </Badge>
                </div>
              </Card>

              {/* Live Practice History */}
              <AttemptHistoryList
                onOpenLogModal={() => setShowLogModal(true)}
                refreshTrigger={attemptsRefreshTrigger}
              />
            </div>
          )}

          {activeTab === 'planner' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#5C4033] bg-white border border-[#E8E2D8] rounded-2xl shadow-xs max-w-2xl mx-auto my-auto">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center mb-3 text-2xl">
                📋
              </div>
              <h3 className="text-base font-bold text-[#1C1C1C]">
                AI Revision Planner
              </h3>
              <p className="text-xs text-[#8C7E72] mt-1 max-w-sm leading-relaxed">
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

      {/* Log Practice Attempt Modal (Member B) */}
      <LogAttemptModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSuccess={() => setAttemptsRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  )
}
