export default function InputSubtitle ({ id }) {
  return (
    <input
      data-subtitle
      type="text"
      name={`${id}`}
      id={`${id}`}
      autoFocus
      className="outline-none text-step2 bg-transparent focus:border-b focus:border-gray"
      placeholder="Añade un subtitulo..."
    />
  )
}
