export default function StatusIndicator({
  status = 'ok',
  label = null,
  className = '',
}) {
  const isOk = status === 'ok' || status === 'connected'

  const displayLabel =
    label || (isOk ? 'Backend Connected' : 'Offline / Degraded Mode')

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
        isOk
          ? 'bg-[#98D8B0]/20 text-[#174e37] border-[#98D8B0]/40'
          : 'bg-[#FCE8E1] text-[#D97757] border-[#D97757]/30'
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {isOk && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#57B2A0] opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOk ? 'bg-[#57B2A0]' : 'bg-[#D97757]'
          }`}
        />
      </span>
      <span>{displayLabel}</span>
    </div>
  )
}
