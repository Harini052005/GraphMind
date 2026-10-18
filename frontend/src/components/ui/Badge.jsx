export default function Badge({
  children,
  variant = 'mint',
  size = 'sm',
  dot = false,
  dotColor = null,
  className = '',
  ...props
}) {
  const variants = {
    mint: 'bg-[#98D8B0]/25 text-[#164332] border border-[#98D8B0]/60',
    sage: 'bg-[#57B2A0]/20 text-[#1C5248] border border-[#57B2A0]/50',
    terracotta: 'bg-[#FCE8E1] text-[#B85333] border border-[#D97757]/40',
    neutral: 'bg-[#FAF7F2] text-[#5C4033] border border-[#E8E2D8]',
    muted: 'bg-[#E8E2D8]/60 text-[#7A6F64] border border-[#E8E2D8]',
    dark: 'bg-[#1C1C1C] text-white border border-[#1C1C1C]',
    outline: 'bg-white text-[#5C4033] border border-[#E8E2D8]',
  }

  const dotColors = {
    mint: 'bg-[#2E7D5B]',
    sage: 'bg-[#57B2A0]',
    terracotta: 'bg-[#D97757]',
    neutral: 'bg-[#8C7E72]',
    muted: 'bg-[#8C7E72]',
    dark: 'bg-[#98D8B0]',
    outline: 'bg-[#8C7E72]',
  }

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    sm: 'text-xs px-2.5 py-1 font-medium gap-1.5',
    md: 'text-sm px-3 py-1 font-medium gap-2',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full select-none ${variants[variant] || variants.mint} ${sizes[size] || sizes.sm} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColor || dotColors[variant] || dotColors.mint
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  )
}
