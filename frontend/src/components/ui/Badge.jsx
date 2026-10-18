export default function Badge({
  children,
  variant = 'muted',
  size = 'sm',
  className = '',
  dot = false,
  dotColor = null,
  ...props
}) {
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-sm px-3 py-1 gap-2',
  }

  const variantClasses = {
    mint: 'bg-[#98D8B0]/25 text-[#18533b] border border-[#98D8B0]/50 font-medium',
    sage: 'bg-[#57B2A0]/20 text-[#215d52] border border-[#57B2A0]/40 font-medium',
    terracotta: 'bg-[#FCE8E1] text-[#D97757] border border-[#D97757]/40 font-medium',
    muted: 'bg-[#E8E2D8]/60 text-[#7A6F64] border border-[#E8E2D8] font-medium',
    dark: 'bg-[#1C1C1C] text-white border border-[#1C1C1C] font-semibold',
    outline: 'bg-white text-[#5C4033] border border-[#E8E2D8] font-medium',
  }

  const dotColorClasses = {
    mint: 'bg-[#57B2A0]',
    terracotta: 'bg-[#D97757]',
    sage: 'bg-[#57B2A0]',
    muted: 'bg-[#8C7E72]',
    dark: 'bg-white',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full select-none ${
        sizeClasses[size] || sizeClasses.sm
      } ${variantClasses[variant] || variantClasses.muted} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColor ? dotColor : dotColorClasses[variant] || 'bg-current'
          }`}
        />
      )}
      {children}
    </span>
  )
}
