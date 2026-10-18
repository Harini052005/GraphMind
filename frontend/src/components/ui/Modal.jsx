import { useEffect } from 'react'

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
}) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1C1C]/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidth} bg-white border border-[#E8E2D8] rounded-2xl shadow-xl overflow-hidden z-10 transition-transform duration-200 animate-in fade-in zoom-in-95`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E8E2D8]/80 bg-[#FAF7F2]">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-[#1C1C1C]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#8C7E72] mt-0.5">{subtitle}</p>
              )}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#8C7E72] hover:text-[#1C1C1C] hover:bg-[#E8E2D8]/50 transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
