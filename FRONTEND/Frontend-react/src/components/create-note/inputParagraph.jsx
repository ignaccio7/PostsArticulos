import DOMPurify from 'dompurify'
import { useState, useEffect, useRef } from 'react'

export default function InputParagraph ({ id, content = '' }) {
  const refInput = useRef('')
  const [paragraph, setParagraph] = useState(content)

  useEffect(() => {
    refInput.current.focus()
  }, [])

  useEffect(() => {
    const sanitizedContent = DOMPurify.sanitize(content)
    const finalizedContent = sanitizedContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    setParagraph(finalizedContent)
  }, [content])

  return (
    <div
      data-paragraph
      contentEditable
      dangerouslySetInnerHTML={{ __html: paragraph }}
      name={`${id}`}
      id={`${id}`}
      ref={refInput}
      className="w-full p-1 h-fit break-words text-step1 whitespace-pre-wrap"
      placeholder="Añade una descripcion cualquiera...."
    />
  )
}
