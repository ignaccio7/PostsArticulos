import { useEffect, useState } from 'react'

import { useParams, useNavigate } from 'react-router-dom'
import Note from '../../services/Notes'
import { useSessionStore } from '../../store/session'
import { toast } from 'sonner'
import DOMPurify from 'dompurify'
import Popularity from '../../components/note/Popularity'
import Comments from '../../components/note/Comments'

export default function ReadNote () {
  const navigate = useNavigate()

  const accessToken = useSessionStore(state => state.accessToken)
  const { id } = useParams()

  const [note, setNote] = useState({})
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')

  const [popularity, setPopularity] = useState({
    likes: 0,
    comments: 0,
    isLike: 0,
    isPublished: 0
  })

  const [user, setUser] = useState({
    username: '',
    fullname: '',
    image: '',
    fechaPost: ''
  })

  useEffect(() => {
    console.log('abc')

    Note.getNoteForRead({ idNote: id, accessToken })
      .then(res => {
        console.log(res)

        const data = res.note
        const pop = res.popularity

        console.log(data)
        console.log(typeof data)
        console.log(typeof data.jsondata)

        // const [t, st, ...rest] = JSON.parse(data.jsonData)
        const [t, st, ...rest] = data.jsondata
        setTitle(t.content)
        setSubtitle(st.content)
        setNote([...rest])
        setUser({
          username: data.usuario ?? '',
          fullname: data.fullname ?? '',
          image: data.avatar ?? '',
          fechaPost: data.fechapost ?? ''
        })
        setPopularity({
          likes: pop.likes ?? 0,
          comments: pop.comments ?? 0,
          islike: pop.islike ?? 0,
          isPublished: pop.isPublished ?? 0
        })
      })
      .catch(e => {
        console.log(e)
        toast.error(e.message)
        navigate(-1)
      })
  }, [])

  // TODO: habilitar funcion para que de like a la nota
  // TODO: crear opcion de aprobar notas

  return (
    <article className="container flex flex-col gap-2 mt-2 mb-8 w-full">
      <h1 className='text-step5 font-bold'>{title}</h1>
      <p className='text-step1 whitespace-pre-line'>{subtitle}</p>
      {/* InfoUser */}
      <div className="info flex flex-row gap-4 flex-wrap items-center my-4 leading-none max-w-[1000px]">
        <picture className='block w-20 h-20 rounded-full overflow-hidden'>
          <img
            className='w-full h-full aspect-square object-cover'
            src={user.image ?? '/logo.png'}
            alt={`Imagen de ${user.username}`} />
        </picture>
        <div className="personal_info flex-1">
          <h4>{user.fullname}</h4>
          <p className='flex flex-row gap-2 justify-between text-third'>
            <span>{user.username}</span>
            <span>{new Date(user.fechaPost).toLocaleDateString()}</span>
          </p>
        </div>
      </div>
      {/* Actions - Popularity */}
      {
        popularity.isPublished !== 0 && <Popularity {...popularity} accessToken={accessToken} />
      }
      {/* ContentCard */}
      <div className="w-full bg-white shadow-md rounded-xl p-4 sm:py-4 sm:px-10 text-black flex flex-col gap-4 max-w-[1000px]">
        {
          note.length > 0
            ? (
                note.map(el => {
                  if (el.tag === 'title') {
                    return (<h1 className='text-step5 font-bold' key={`${el.id}`}>{el.content}</h1>)
                  }
                  if (el.tag === 'subtitle') {
                    return (<h2 className='text-step4 font-bold' key={`${el.id}`}>{el.content}</h2>)
                  }
                  if (el.tag === 'image') {
                    return (<img className='max-w-5xl w-full max-h-[450px] object-contain aspect-video' src={el.content.image} alt='Imagen de la nota' key={`${el.id}`} />)
                  }
                  const sanitizedContent = DOMPurify.sanitize(el.content)
                  const finalizedContent = sanitizedContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  return (<p className='text-step1 whitespace-pre-line' key={`${el.id}`} dangerouslySetInnerHTML={{ __html: finalizedContent }} />)
                }))
            : (<p className='text-step1 whitespace-pre-line text-slate-700'>No hay contenido para mostrar</p>)
        }
      </div>
      {/* Comments */}
      {
        popularity.isPublished !== 0 && <Comments idNote={popularity.isPublished} accessToken={accessToken} />
      }
    </article>
  )
}
