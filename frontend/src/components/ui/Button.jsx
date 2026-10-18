export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon = null,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#98D8B0] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer gap-2 select-none'

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 h-7',
    md: 'text-sm px-4 py-2 h-9',
    lg: 'text-base px-5 py-2.5 h-11',
  }

  const variantClasses = {
    primary:
      'bg-[#98D8B0] text-[#1C1C1C] hover:bg-[#86cba0] shadow-xs font-semibold',
    secondary:
      'bg-[#57B2A0] text-white hover:bg-[#4a9f8f] shadow-xs',
    outline:
      'bg-white border border-[#E8E2D8] text-[#1C1C1C] hover:bg-[#FAF7F2] hover:border-[#57B2A0]',
    ghost:
      'bg-transparent text-[#5C4033] hover:bg-[#FAF7F2] hover:text-[#1C1C1C]',
    danger:
      'bg-[#D97757] text-white hover:bg-[#c66849] shadow-xs',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
