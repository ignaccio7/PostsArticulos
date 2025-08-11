import { useEffect, useState , useCallback } from 'react'

import Note from '../../services/Notes'
import { useSessionStore } from '../../store/session'
import { useSearchParams } from 'react-router-dom'
import Pagination from '../../components/ui/filters/Pagination'
import Table from '../../components/ui/Table'
import Title from '../../components/ui/Title'
import Filters from '../../components/ui/Filters'
import debounce from 'just-debounce-it'

export default function Notes () {
  const accessToken = useSessionStore(state => state.accessToken)

  const [notes, setNotes] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [searchParams, setSearchParams] = useSearchParams()

  const getNotes = async (accessToken, query) => {
    Note.getNotesByUser({ accessToken, query })
      .then(data => {
        console.log('new notes')
        setPage(data.page)
        setNotes(data.data)
        setTotalPages(data.totalPages)
      })
      .catch((error) => {
        console.log('Error aqui')
        console.log(error)
        
      })
  }
  const debounceSearchNotes = useCallback( debounce(async (accessToken, query) => {
    getNotes(accessToken, query)
  }, 500, true), [])

  useEffect(() => {
    const params = Object.fromEntries(searchParams)
    const keys = Object.keys(params)

    const newQuery = keys.map(k => `${k}=${params[k]}`).join('&')

    debounceSearchNotes(accessToken, newQuery)
    // console.log(newQuery)

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
