import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRefreshStore } from '../../../store/refresh'

export default function SearchBox () {
  const refresh = useRefreshStore(state => state.refresh)

  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(() => {
    const params = Object.fromEntries(searchParams)
    return params?.titulo ?? ''
  })

  const handleSearchChange = (event) => {
    const newSearch = event.target.value
    // console.log(newSearch)

    setSearch(newSearch)
    setSearchParams((prevParams) => {
      const newSearchParams = Object.fromEntries(prevParams)

      if (newSearchParams?.page) delete newSearchParams.page

      if (newSearch === '') {
        delete newSearchParams.titulo
        return { ...newSearchParams }
      }
      return { ...newSearchParams, titulo: newSearch }
    })
  }

  useEffect(() => {
    setSearch('')
  }, [refresh])

  return (
    <div className="searchBox">
      <input type="search" name="search" id="search"
        className="text-step1 border border-slate-200 px-2 py-1 rounded-md" placeholder="Buscar..."
        value={search}
        onChange={handleSearchChange}
      />
    </div>
  )
}
