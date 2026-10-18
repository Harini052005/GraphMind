import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function MetricOverviewCards({ overview = {} }) {
  const {
    totalAttempted = 0,
    totalSolved = 0,
    totalFailed = 0,
    totalIncomplete = 0,
    overallSuccessRate = 0,
    totalPracticeTimeMinutes = 0,
    daysSinceLastSession = 0,
    weakPatternsCount = 0,
  } = overview

  const hours = Math.floor(totalPracticeTimeMinutes / 60)
  const remainingMins = totalPracticeTimeMinutes % 60
  const timeFormatted =
    hours > 0 ? `${hours}h ${remainingMins}m` : `${totalPracticeTimeMinutes}m`

  const cards = [
    {
      title: 'Problems Solved',
      value: `${totalSolved}`,
      subvalue: `of ${totalAttempted} attempted`,
      badge: `${totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0}% Solved`,
      badgeVariant: 'mint',
      icon: (
        <svg
          className="w-5 h-5 text-[#57B2A0]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      footer: (
        <div className="w-full bg-[#FAF7F2] border border-[#E8E2D8] h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-[#57B2A0] h-full rounded-full transition-all duration-500"
            style={{
              width: `${totalAttempted > 0 ? (totalSolved / totalAttempted) * 100 : 0}%`,
            }}
          />
        </div>
      ),
    },
    {
      title: 'Success Rate',
      value: `${overallSuccessRate}%`,
      subvalue: `${totalFailed} failed · ${totalIncomplete} partial`,
      badge:
        overallSuccessRate >= 70
          ? 'Strong Pace'
          : overallSuccessRate >= 50
          ? 'Moderate'
          : 'Needs Focus',
      badgeVariant:
        overallSuccessRate >= 70
          ? 'mint'
          : overallSuccessRate >= 50
          ? 'sage'
          : 'terracotta',
      icon: (
        <svg
          className="w-5 h-5 text-[#57B2A0]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      footer: (
        <div className="w-full bg-[#FAF7F2] border border-[#E8E2D8] h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallSuccessRate >= 70
                ? 'bg-[#57B2A0]'
                : overallSuccessRate >= 50
                ? 'bg-[#98D8B0]'
                : 'bg-[#D97757]'
            }`}
            style={{ width: `${Math.max(overallSuccessRate, 3)}%` }}
          />
        </div>
      ),
    },
    {
      title: 'Practice Recency & Time',
      value: daysSinceLastSession === 0 ? 'Active Today' : `${daysSinceLastSession}d ago`,
      subvalue: `${timeFormatted} total focus time`,
      badge: daysSinceLastSession === 0 ? 'Consistent' : 'Streak at risk',
      badgeVariant: daysSinceLastSession === 0 ? 'mint' : 'terracotta',
      icon: (
        <svg
          className="w-5 h-5 text-[#5C4033]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      footer: (
        <p className="text-[11px] text-[#8C7E72] mt-2.5 truncate">
          Logged across {overview.patternsPracticedCount || 0} distinct patterns
        </p>
      ),
    },
    {
      title: 'Weak Pattern Alerts',
      value: `${weakPatternsCount}`,
      subvalue:
        weakPatternsCount === 1 ? 'topic flagged for revision' : 'topics flagged for revision',
      badge: weakPatternsCount > 0 ? 'Action Required' : 'All Clear',
      badgeVariant: weakPatternsCount > 0 ? 'terracotta' : 'mint',
      icon: (
        <svg
          className="w-5 h-5 text-[#D97757]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      footer: (
        <p className="text-[11px] text-[#D97757] font-medium mt-2.5 truncate">
          {weakPatternsCount > 0
            ? 'Prerequisite gaps & repeat mistakes found'
            : 'No weak pattern anomalies detected'}
        </p>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className="p-5 flex flex-col justify-between hover:border-[#57B2A0]/50 transition-all shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7E72]">
                {card.title}
              </span>
              <div className="p-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8]">
                {card.icon}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-[#1C1C1C]">
                {card.value}
              </span>
              <Badge variant={card.badgeVariant} size="xs">
                {card.badge}
              </Badge>
            </div>

            <p className="text-xs text-[#5C4033] mt-1">{card.subvalue}</p>
          </div>

          <div>{card.footer}</div>
        </Card>
      ))}
    </div>
  )
}
