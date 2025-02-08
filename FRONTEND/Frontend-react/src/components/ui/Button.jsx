const SIZE_BUTTON = {
  sm: '300px',
  md: '400px',
  lg: '500px',
  xl: '700px'
}

const THEME_BUTTON = {
  default: 'btn-default',
  primary: 'btn-primary',
  danger: 'btn-danger'
}

export default function Button ({
  className,
  size,
  type = 'button',
  theme = 'default',
  onClick,
  isSubmitting = false,
  children
}) {
  const selectedTheme = THEME_BUTTON[theme]
  return (
    <button
      className={`        
        max-w-[80%]
        mt-8
        px-2
        py-2
        text-step1
        rounded-xl
        font-bold
        transition-colors
        duration-500
        ease-in-out
        cursor-pointer
        ${selectedTheme}
    ${className}`}
    onClick={onClick}
    type={type}
    style={{ width: SIZE_BUTTON[size] }}
    disabled={isSubmitting}
    >
      {children}
    </button>
  )
}
