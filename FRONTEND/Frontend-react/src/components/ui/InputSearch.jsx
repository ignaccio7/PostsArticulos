import { useState, useCallback, useEffect } from 'react'
import { IconSearch } from './Icons'
import debounce from 'just-debounce-it'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useRefreshStore } from '../../store/refresh'

export default function InputSearch () {
  const toggleSearchNewArticles = useRefreshStore(state => state.toggleSearchNewArticles)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(debounce(async (search) => {
    toggleSearchNewArticles()
  }, 500), [])

  const handleSearch = (e) => {
    const newSearch = e.target.value
    setSearch(newSearch)

    if (location.pathname !== '/') {
      navigate(`/?titulo=${e.target.value}`)
      return
    }

    debounceSearch(newSearch)

    const previousParams = Object.fromEntries(searchParams)

    if (newSearch === '') { delete previousParams.titulo } else previousParams.titulo = newSearch
    setSearchParams(previousParams)
  }

  useEffect(() => {
    const previousParams = Object.fromEntries(searchParams)
    if (previousParams?.titulo) setSearch(previousParams.titulo)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') {
      setSearch('')
    }
  }, [location])

  return (
    <label className="w-full flex items-center gap-2 bg-black p-2 rounded-xl">
      <IconSearch />
      <input
        onChange={handleSearch}
        value={search}
        type="search"
        placeholder="Algo que buscar..."
        className="w-full h-full px-2 border-none outline-none"
      />
    </label>
  )
}
