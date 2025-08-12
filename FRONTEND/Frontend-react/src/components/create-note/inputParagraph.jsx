import DOMPurify from 'dompurify'
import { useState, useEffect, useRef } from 'react'

export default function InputParagraph({ id, content = '' }) {
  const refInput = useRef(null)
  const [paragraph, setParagraph] = useState(content)

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus()
    }
  }, [])

  useEffect(() => {
    const sanitizedContent = DOMPurify.sanitize(content)
    const finalizedContent = sanitizedContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    setParagraph(finalizedContent)
    
    if (refInput.current && refInput.current.textContent !== finalizedContent) {
      refInput.current.textContent = finalizedContent
    }
  }, [content])

  const handleInput = (e) => {
    setParagraph(e.target.textContent)
  }

  return (
    <div
      data-paragraph
      contentEditable
      name={`${id}`}
      id={`${id}`}
      ref={refInput}
      onInput={handleInput}
      className="w-full p-1 h-fit break-words text-step1 whitespace-pre-wrap"
      placeholder="Añade una descripcion cualquiera...."
      suppressContentEditableWarning={true}
    />
  )
}