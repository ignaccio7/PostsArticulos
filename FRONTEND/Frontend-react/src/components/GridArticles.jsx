/* eslint-disable camelcase */
import Card from './ui/Card'

export default function GridArticles ({ articles }) {
  if (articles.length === 0) return (<p>No existen articulos para mostrar</p>)

  return (
    <div className="grid-articles grid grid-cols-1 md:grid-cols-4 gap-8">
      {
        articles.map(({ title, description, image, id }) => {
          return (<Card
            className='w-full bg-white/95 text-black'
            key={id} title={title} description={description} image={image} idNota={id}
          />)
        })
      }
    </div>
  )
}
