export default function Card({
  children,
  className = '',
  subtle = false,
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 ${
        subtle
          ? 'bg-[#FAF7F2] border-[#E8E2D8]'
          : 'bg-white border-[#E8E2D8]'
      } ${
        hoverable
          ? 'hover:border-[#57B2A0] hover:shadow-xs cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
