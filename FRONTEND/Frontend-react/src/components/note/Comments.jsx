import { useEffect, useState, useCallback } from 'react'
import Button from '../ui/Button'
import Article from '../../services/Article'
import { toast } from 'sonner'
import { IconTrash } from '../ui/Icons'
import { useAuth } from '../../hooks/useAuth'
export default function Comments ({ idNote, accessToken }) {
  const [comments, setComments] = useState([])
  const { auth } = useAuth()

  const getComments = useCallback(async ({ setComments }) => {
    try {
      const res = await Article.getComments({ accessToken, idNote })
      setComments(res.data)
    } catch (error) {
      console.log(error)
      toast.error('Error al obtener los comentarios')
    }
  }, [])

  useEffect(() => {
    getComments({ setComments })
  }, [])

  const addComment = async (event) => {
    event.preventDefault()
    const newComment = event.target.comment.value
    try {
      await Article.addComment({ accessToken, idNote, comment: newComment })
      await getComments({ setComments })
    } catch (error) {
      console.log(error)
      toast.error('Error al añadir el comentario')
    } finally {
      event.target.reset()
    }
  }

  const deleteComment = async (idComment) => {
    try {
      await Article.deleteComment({ accessToken, idComment })
      await getComments({ setComments })
    } catch (error) {
      toast.error('Error al eliminar el comentario')
    }
  }

  return (
    <div className="comments my-4 flex flex-col gap-4">
      <h2>Comentarios ({comments.length})</h2>

      {
        auth && (
          <form
          onSubmit={addComment}
          className='w-full max-w-4xl flex flex-row justify-start bg-white px-4 py-3 rounded-md'
        >
          <label
            htmlFor="comment"
            className='basis-80 h-full text-black pl-3 pr-2 flex-1 bg-white'
          >
            <input
              name='comment'
              id='comment'
              type="text"
              required
              className='w-full h-full pr-9 py-3 bg-white outline-none border-none text-step1'
              placeholder='Escribe tu comentario'
            />
          </label>
          <Button className="!mt-0 px-8" theme='default' type='submit'>
            Enviar
          </Button>
        </form>
        )
      }

      <div className='w-full bg-white mt-2 rounded-md p-6 text-black text-step1 flex flex-col gap-4 max-w-[1000px]'>
        {
          comments.length === 0
            ? <p className='text-step1 whitespace-pre-line text-[#9ca3af]'>No hay comentarios para mostrar</p>
            : comments.map(comment => {
              return (
                <div
                  className={'comment flex flex-col gap-3'}
                  key={comment.id_comentario}>
                  <article className="user flex flex-row gap-2 items-center">
                    <header className='flex flex-row gap-2 justify-between w-full'>
                      <div className="user">
                        <img
                          src={comment.avatar}
                          alt="user1"
                          className='w-14 h-14 rounded-full aspect-square'
                        />
                        <p className={`leading-none text-step1 ${comment.isMyComment === 0 ? 'text-zinc-700' : 'text-third'}`}>
                          {comment.usuario} <br />
                          <span className='text-step0'>{new Date(comment.fechaPub).toLocaleDateString()}</span>
                        </p>
                      </div>
                      {
                        comment.isMyComment !== 0 && (
                          <button
                            className='text-zinc-700 hover:scale-[1.05] transition-transform duration-300'
                            onClick={() => deleteComment(comment.id_comentario)}
                          >
                            <IconTrash />
                          </button>
                        )
                      }
                    </header>
                  </article>
                  <p>
                    {comment.comment}
                  </p>
                </div>
              )
            })
        }
      </div>
    </div>
  )
}
