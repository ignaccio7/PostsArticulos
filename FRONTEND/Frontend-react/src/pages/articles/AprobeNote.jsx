import Article from '../../services/Article'
import { useSessionStore } from '../../store/session'
import Button from '../../components/ui/Button'
import Title from '../../components/ui/Title'
import Filters from '../../components/ui/Filters'
import Pagination from '../../components/ui/filters/Pagination'
import TableForApprove from '../../components/ui/TableForApprove'
import { toast } from 'sonner'
import { useArticles } from '../../hooks/useArticles'
import { useNotesforApprove } from '../../hooks/useNotes'

export default function AprobeNote () {
  const accessToken = useSessionStore(state => state.accessToken)
  const { notesForApprove, clearNotesForApprove } = useNotesforApprove()

  const { notes, page, totalPages, getArticles } = useArticles({ accessToken, method: 'getNotesForApprove' })

  const approveNotes = async () => {
    if (notesForApprove.length === 0) return toast.error('No hay notas para aprobar')
    try {
      await Article.approveNotes({ accessToken, idNotes: notesForApprove })
      clearNotesForApprove()
      toast.success('Notas aprobadas')
      await getArticles({ refresh: true })
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <section className="approve_note container">
      <Title title={'Aprobar notas'} />
      <Filters />
      <Pagination actualPage={page} total={totalPages} />
      <TableForApprove results={notes} />

      {
        notesForApprove?.length > 0 && (
          <div className="notes sticky bottom-8 flex justify-end">
            <div className="content w-full max-w-[20ch] min-w-72 h-auto bg-slate-500 border border-primary rounded-md p-2 text-start break-words text-step0">
              {notesForApprove.join('-')}
            </div>
          </div>
        )
      }
      <Button size="md" theme='primary' className={'mb-2 mt-2}'} onClick={() => approveNotes()}>
        Aprobar notas
      </Button>

    </section>
  )
}
