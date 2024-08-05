export default function InputTitle ({ id }) {
  return (
    <input
      data-title
      type="text"
      name={`${id}`}
      id={`${id}`}
      autoFocus
      className="outline-none text-step3 bg-transparent focus:border-b focus:border-gray"
      placeholder="Titulo: Novedad JS, Nueva etiqueta Search, ...."
    />
  )
}
