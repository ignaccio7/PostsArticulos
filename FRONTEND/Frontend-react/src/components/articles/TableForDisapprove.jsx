// import { useEffect } from 'react'
import { IconCheck, IconChecked } from '../ui/Icons'
import { useNotesforApprove } from '../../hooks/useNotes'
import { Link } from 'react-router-dom'

export default function TableForDisapprove ({ results = [] }) {
  // if (results.length === 0) return <div>No existen notas para aprobar</div>

  const { notesForDisapprove, addNewNoteForDisapprove, deleteNoteForDisapprove } = useNotesforApprove()

  // useEffect(() => {
  //   console.log(notesForDisapprove)
  // }, [notesForDisapprove])

  if (results.length === 0) return (<div className='text-step2'>No existen notas para aprobar</div>)

  return (
    <>
      <div className="tableForApprove w-full mb-8 flex flex-col gap-4">
        {
          results.map(note => {
            const isCheked = notesForDisapprove.includes(note.id)
            const urlImage = note?.image ? note.image : '/logo.png'
            const dateOfPub = new Date(note.fechaPub)
            const descriptionSanitized = note?.description?.replace('&lt;', '<').replace('&gt;', '>')
            const titleUrl = note.title.replace(/[/\\]/g, '').replace(/\s+/g, '-')
            return (
              <article
                className={`
                item w-full flex flex-row items-center justify-between border-b-4 border-primary pb-3 hover:bg-slate-700 transition-colors duration-500 ease
                ${isCheked ? 'bg-slate-700' : ''}
              `}
                key={note.id}
              >
                <div className="check mr-2">
                  <button onClick={() => {
                    if (isCheked) {
                      deleteNoteForDisapprove(note.id)
                    } else {
                      addNewNoteForDisapprove(note.id)
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
                  <img src={`${urlImage}`} alt={`Imagen de la nota ${note.title}`} className="w-full h-full object-cover rounded-md" />
                </picture>
                <Link to={`/note/${note.link}/${titleUrl}`} className="content flex-1 flex flex-col py-2 px-4 text-slate-200 max-w-[250px] min-[450px]:max-w-none">
                  <h4 className='font-semibold break-words w-full'>{note.title}</h4>
                  {/* <p className='text-step1 whitespace-normal'>{note.description}</p> */}
                  <p
                    className='text-step1 whitespace-pre-line line-clamp-2 w-full break-words'
                  >
                    {descriptionSanitized}
                  </p>
                  <p className="flex flex-row gap-1 justify-between mt-2 text-third font-semibold mr-4">
                    <span className="date">
                      {dateOfPub.toLocaleDateString()}
                    </span>
                    <span className="author">
                      {note.author}
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
