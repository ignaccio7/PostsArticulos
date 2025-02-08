import { useEffect } from 'react'
import { IconCheck, IconChecked } from './Icons'
import { useNotesforApprove } from '../../hooks/useNotes'
import { Link } from 'react-router-dom'

export default function TableForApprove ({ results = [] }) {
  // if (results.length === 0) return <div>No existen notas para aprobar</div>

  const { notesForApprove, addNewNoteForApprove, deleteNote } = useNotesforApprove()

  // useEffect(() => {
  //   console.log(notesForApprove)
  // }, [notesForApprove])

  if (results.length === 0) return (<div className='text-step2'>No existen notas para aprobar</div>)

  return (
    <>
      <div className="tableForApprove w-full mb-8 flex flex-col gap-4">
        {
          results.map(note => {
            const isCheked = notesForApprove.includes(note.id_nota)
            const urlImage = note?.image_url ? note.image_url : '/logo.png'
            const dateOfPost = new Date(note.fechaPost)
            const descriptionSanitized = note.descripcion.replace('&lt;', '<').replace('&gt;', '>')

            const titleUrl = note.titulo.replace(/[/\\]/g, '').replace(/\s+/g, '-')

            return (
              <article
                className={`
                item w-full flex flex-row items-center justify-between border-b-4 border-primary pb-3 hover:bg-slate-700 transition-colors duration-500 ease
                ${isCheked ? 'bg-slate-700' : ''}
              `}
                key={note.id_nota}
              >
                <div className="check mr-2">
                  <button onClick={() => {
                    if (isCheked) {
                      deleteNote(note.id_nota)
                    } else {
                      addNewNoteForApprove(note.id_nota)
                    }
                  }}>
                    {
                      isCheked
                        ? <IconChecked />
                        : <IconCheck />
                    }
                  </button>
                </div>
                <picture className="min-w-[70px] w-[70px] h-auto min-[480px]:w-[100px] min-[480px]:min-w-[100px] aspect-square">
                  <img src={`${urlImage}`} alt={`Imagen de la nota ${note.titulo}`} className="w-full h-full object-cover rounded-md" />
                </picture>
                <Link to={`/note/${note.id_nota}/${titleUrl}`} className="content flex-1 flex flex-col py-2 px-4 text-slate-200 max-w-[250px] min-[450px]:max-w-none">
                  <h4 className='font-semibold break-words w-full'>{note.titulo}</h4>
                  {/* <p className='text-step1 whitespace-normal'>{note.description}</p> */}
                  <p
                    className='text-step1 whitespace-pre-line line-clamp-2 w-full break-words'
                  >
                    {descriptionSanitized}
                  </p>
                  <p className="flex flex-row gap-1 justify-between mt-2 text-third font-semibold mr-4">
                    <span className="date">
                      {dateOfPost.toLocaleDateString()}
                    </span>
                    <span className="author">
                      {note.usuario}
                    </span>
                  </p>
                </Link>
              </article>
            )
          })
        }
      </div>
    </>
  )
}
