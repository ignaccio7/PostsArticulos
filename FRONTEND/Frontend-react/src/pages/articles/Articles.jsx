import Article from '../../services/Article'
import { useSessionStore } from '../../store/session'
import Button from '../../components/ui/Button'
import Title from '../../components/ui/Title'
import Filters from '../../components/ui/Filters'
import Pagination from '../../components/ui/filters/Pagination'
import { toast } from 'sonner'
import { useNotesforApprove } from '../../hooks/useNotes'
import TableForDisapprove from '../../components/articles/TableForDisapprove'
import { useArticles } from '../../hooks/useArticles'

export default function AprobeNote () {
  const accessToken = useSessionStore(state => state.accessToken)
  const { notesForDisapprove, clearNotesForDisapprove } = useNotesforApprove()

  const { notes, page, totalPages, getArticles } = useArticles({ accessToken, perPage: 5, method: 'getAll' })

  const disapproveNotes = async () => {
    if (notesForDisapprove.length === 0) return toast.error('No hay notas para desaprobar')
    try {
      await Article.disapproveNotes({ accessToken, idNotes: notesForDisapprove })
      clearNotesForDisapprove()
      getArticles({ refresh: true })
      toast.success('Notas Desaprobadas')
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <section className="approve_note container">
      <Title title={'Articulos'} />
      <Filters />
      <Pagination actualPage={page} total={totalPages} />
      {/* <TableForApprove results={notes} /> */}
      <TableForDisapprove results={notes} />

      {
        notesForDisapprove?.length > 0 && (
          <div className="notes sticky bottom-8 flex justify-end">
            <div className="content w-full max-w-[20ch] min-w-72 h-auto bg-slate-500 border border-primary rounded-md p-2 text-start break-words text-step0">
              {notesForDisapprove.join('-')}
            </div>
          </div>
        )
      }
      <Button size="md" theme='danger' className={'mb-2 mt-2}'} onClick={() => disapproveNotes()}>
        Desaprobar notas
      </Button>

    </section>
  )
}
