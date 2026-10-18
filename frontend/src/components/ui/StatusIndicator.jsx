export default function StatusIndicator({
  status = 'ok',
  label,
  className = '',
}) {
  const isOk = status === 'ok'
  const isLoading = status === 'loading'

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        isOk
          ? 'bg-[#98D8B0]/20 text-[#1C5248] border-[#98D8B0]/50'
          : isLoading
            ? 'bg-[#FAF7F2] text-[#8C7E72] border-[#E8E2D8]'
            : 'bg-[#FCE8E1] text-[#B85333] border-[#D97757]/40'
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {isOk && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#57B2A0] opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOk
              ? 'bg-[#57B2A0]'
              : isLoading
                ? 'bg-[#8C7E72]'
                : 'bg-[#D97757]'
          }`}
        />
      </span>
      <span>
        {label ||
          (isOk
            ? 'Backend Connected'
            : isLoading
              ? 'Connecting...'
              : 'Offline / Degraded Mode')}
      </span>
    </div>
  )
}
