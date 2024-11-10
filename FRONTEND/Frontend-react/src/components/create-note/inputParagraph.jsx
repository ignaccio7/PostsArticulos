import { useEffect, useRef } from 'react'

export default function InputParagraph ({ id, content = '' }) {
  const refInput = useRef('')

  useEffect(() => {
    refInput.current.focus()
  }, [])

  useEffect(() => {
    refInput.current.innerHTML = content
  }, [content])

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
