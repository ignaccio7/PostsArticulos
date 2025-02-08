import { useEffect, useState } from 'react'

import Note from '../../services/Notes'
import { useSessionStore } from '../../store/session'
import { useSearchParams } from 'react-router-dom'
import Pagination from '../../components/ui/filters/Pagination'
import Table from '../../components/ui/Table'
import Title from '../../components/ui/Title'
import Filters from '../../components/ui/Filters'

export default function Notes () {
  const accessToken = useSessionStore(state => state.accessToken)

  const [notes, setNotes] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const params = Object.fromEntries(searchParams)
    const keys = Object.keys(params)

    const newQuery = keys.map(k => `${k}=${params[k]}`).join('&')
    // console.log(newQuery)

    Note.getNotesByUser({ accessToken, query: newQuery })
      .then(data => {
        console.log('new notes')
        setPage(data.page)
        setNotes(data.data)
        setTotalPages(data.totalPages)
      })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <section className="container">
      <Title title={'Mis notas'} />

      <Filters />

      <Pagination total={totalPages} actualPage={page} />

      <Table results={notes} />
    </section>
  )
}
