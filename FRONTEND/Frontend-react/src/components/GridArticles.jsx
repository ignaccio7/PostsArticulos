/* eslint-disable camelcase */
import Card from './ui/Card'

export default function GridArticles ({ articles }) {
  if (articles.length === 0) return (<p>No existen articulos para mostrar</p>)

  console.log(articles)

  return (
    <div className="grid-articles grid grid-cols-1 md:grid-cols-4 gap-4">
      {
        articles.map(({ id, title, description, image, link, author, likes, comments, islike }) => {
          return (
            <Card key={`${id}-${title}-${description}`}
              title={title}
              description={description}
              image={image}
              idNotaPub={id}
              link={link}
              author={author}
              likes={likes}
              comments={comments}
              islike={islike}
              className='w-full bg-white/95 text-black' />
          )
        })
      }
    </div>
  )
}
