const SIZE_BUTTON = {
  sm: '300px',
  md: '400px',
  lg: '500px',
  xl: '700px'
}

export default function Button ({ className, size, onClick, children }) {
  return (
    <button
      className={`        
        max-w-[80%]
        mt-8
        px-2
        py-2
        text-step1
        bg-secondary
        border-none
        rounded-xl
        font-bold
        transition-colors
        duration-500
        ease-in-out
        hover:bg-primary
        hover:text-white      
    ${className}`}
    onClick={onClick}
    style={{ width: SIZE_BUTTON[size] }}
    >
      {children}
    </button>
  )
}
