import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import Article from '../services/Article'
import { toast } from 'sonner'
import { useRefreshStore } from '../store/refresh'

export function useArticles ({ accessToken = '', perPage, method = '' }) {
  const toggleRefresh = useRefreshStore(state => state.toggleRefresh)

  const [notes, setNotes] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [searchParams, setSearchParams] = useSearchParams() // TODO: Crear un seed para la base de datos y probar en otra compu

  const getArticles = async ({ refresh = false } = {}) => {
    let params = Object.fromEntries(searchParams)

    if (perPage && !params.perPage) params.perPage = perPage

    if (refresh) {
      toggleRefresh()
      params = {}
      setSearchParams({})
    }

    const keys = Object.keys(params)
    const query = keys.map(k => `${k}=${params[k]}`).join('&')

    try {
      const res = await Article[`${method}`]({ accessToken, query })
      setNotes(res.data)
      setPage(res.page)
      setTotalPages(res.totalPages)
    } catch (e) {
      console.error(e)
      setNotes([])
      toast.error(e.message)
    }
  }

  useEffect(() => {
    getArticles()
  }, [searchParams])

  return {
    notes,
    page,
    totalPages,
    getArticles
  }
}
