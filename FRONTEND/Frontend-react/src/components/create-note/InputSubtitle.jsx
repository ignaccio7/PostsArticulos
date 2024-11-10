import { useState, useEffect } from 'react'

export default function InputSubtitle ({ id, content = '' }) {
  const [subTitle, setSubtitle] = useState('')

  useEffect(() => {
    setSubtitle(content)
  }, [content])
  return (
    <input
      data-subtitle
      type="text"
      name={`${id}`}
      id={`${id}`}
      value={subTitle}
      onChange={(e) => setSubtitle(e.target.value)}
      autoFocus
      className="outline-none text-step2 bg-transparent focus:border-b focus:border-gray"
      placeholder="Añade un subtitulo..."
    />
  )
}
