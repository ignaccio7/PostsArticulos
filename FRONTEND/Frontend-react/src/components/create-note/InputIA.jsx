import { useEffect, useRef } from 'react'

export default function InputIA ({ id }) {
  const refInput = useRef('')

  useEffect(() => {
    refInput.current.focus()
  }, [])
  return (
    <div
      data-paragraph
      contentEditable
      ref={refInput}
      name={`${id}`}
      id={`${id}`}
      className="w-full p-1 h-fitbreak-words text-step1"
      placeholder="Pidele a la IA que te ayude."
    />
  )
}
