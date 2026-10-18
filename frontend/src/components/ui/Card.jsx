export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E8E2D8] rounded-2xl shadow-xs transition-all duration-200 ${
        hover ? 'hover:border-[#57B2A0]/60 hover:shadow-sm cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
