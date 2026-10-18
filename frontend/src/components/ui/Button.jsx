export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    primary:
      'bg-[#98D8B0] text-[#1C1C1C] hover:bg-[#85c99f] active:scale-[0.98] focus:ring-[#98D8B0] shadow-xs',
    secondary:
      'bg-[#57B2A0] text-white hover:bg-[#4ba08f] active:scale-[0.98] focus:ring-[#57B2A0] shadow-xs',
    outline:
      'bg-white text-[#1C1C1C] border border-[#E8E2D8] hover:bg-[#FAF7F2] hover:border-[#d5cdc2] active:scale-[0.98] focus:ring-[#57B2A0]',
    ghost:
      'bg-transparent text-[#5C4033] hover:text-[#1C1C1C] hover:bg-[#FAF7F2] active:scale-[0.98] focus:ring-[#E8E2D8]',
    danger:
      'bg-[#D97757] text-white hover:bg-[#c66849] active:scale-[0.98] focus:ring-[#D97757] shadow-xs',
  }

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
