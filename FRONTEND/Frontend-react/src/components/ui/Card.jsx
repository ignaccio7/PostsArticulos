import { Link } from 'react-router-dom'
import { IconCommentOutline, IconHeart, IconHeartOutline } from './Icons'

export default function Card ({
  title,
  description,
  image,
  idNotaPub,
  link,
  author,
  likes,
  comments,
  islike, className = ''
}) {
  // const urlImage = !image ? '/logo.png' : image
  const urlImage = image ?? '/logo_sin_fondo.png'
  const titleUrl = title.replace(/[/\\]/g, '').replace(/\s+/g, '-')

  return (
    <Link to={`/note/${link}/${titleUrl}`} className='p-0 m-0 block w-full h-full'>
      <article className={`card ${className}`} >
        <picture className='block'>
          <img src={urlImage} className="w-fulll h-auto aspect-square object-cover " alt={`Image of ${title}`} />
        </picture>
        <div className="content flex flex-col h-full">
          <div className='flex-1'>
            <h5 className='w-full truncate'>{title}</h5>
            <p>{description}</p>
          </div>
          <div className="info flex justify-between items-center">
            <div className="social flex gap-2 items-center">
              <span className='flex gap-1 items-center'>
                {islike === 1 ? <IconHeart /> : <IconHeartOutline />}
                {likes}
              </span>
              <span className='flex gap-1 items-center'>
                <IconCommentOutline />
                {comments}
              </span>
            </div>
            <div className="author">
              <h6>{author}</h6>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
