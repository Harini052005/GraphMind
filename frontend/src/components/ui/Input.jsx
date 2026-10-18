export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#8C7E72] outline-none transition-all duration-150 focus:ring-2 disabled:bg-[#FAF7F2] disabled:cursor-not-allowed ${
          error
            ? 'border-[#D97757] focus:ring-[#D97757]/30'
            : 'border-[#E8E2D8] focus:border-[#57B2A0] focus:ring-[#98D8B0]/30'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-[#D97757] font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#8C7E72]">{helperText}</p>
      ) : null}
    </div>
  )
}
