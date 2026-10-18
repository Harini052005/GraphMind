export default function Card({
  children,
  className = '',
  hover = false,
  hoverable = false,
  subtle = false,
  onClick,
  ...props
}) {
  const isHoverable = hover || hoverable

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 shadow-xs ${
        subtle
          ? 'bg-[#FAF7F2] border-[#E8E2D8]'
          : 'bg-white border-[#E8E2D8]'
      } ${
        isHoverable
          ? 'hover:border-[#57B2A0]/70 hover:shadow-sm cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
