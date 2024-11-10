import { useEffect, useState } from 'react'

export default function InputTitle ({ id, content = '' }) {
  const [title, setTitle] = useState(content)

  useEffect(() => {
    setTitle(content)
  }, [content])

  return (
    <input
      data-title
      type="text"
      name={`${id}`}
      id={`${id}`}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      autoFocus
      className="outline-none text-step3 bg-transparent focus:border-b focus:border-gray"
      placeholder="Titulo: Novedad JS, Nueva etiqueta Search, ...."
    />
  )
}
