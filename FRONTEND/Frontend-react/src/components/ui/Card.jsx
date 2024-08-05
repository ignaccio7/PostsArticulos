export default function Card ({ image, title, description, idNota, className = '' }) {
  // const urlImage = !image ? '/logo.png' : image
  const urlImage = image.length < 10 ? '/logo.png' : image

  return (
    <article className={`card ${className}`} >
      <picture>
        <img src={urlImage} />
      </picture>
      <div className="content">
        <div>
          <h5>{title}</h5>
          <p>{description}</p>
        </div>
        <a href={idNota}>Leer más ...</a>
      </div>
    </article >
  )
}
