import { useEffect, useRef } from 'react'

export default function InputParagraph ({ id }) {
  const refInput = useRef('')

  useEffect(() => {
    refInput.current.focus()
  }, [])
  return (
    <div
      data-paragraph
      contentEditable
      name={`${id}`}
      id={`${id}`}
      ref={refInput}
      className="w-full p-1 h-fitbreak-words text-step1"
      placeholder="Añade una descripcion cualquiera...."
    />
  )
}
