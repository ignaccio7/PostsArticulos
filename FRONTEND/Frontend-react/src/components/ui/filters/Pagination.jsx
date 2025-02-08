import { useState, useEffect, useRef } from 'react'
import { getPagination } from '../../../helpers/helpers'
import { IconNext, IconPrevious } from '../Icons'
import { useSearchParams } from 'react-router-dom'

export default function Pagination ({ actualPage = 1, total = 1 }) {
  const [searchParams, setSearchParams] = useSearchParams()

  // const [page, setPage] = useState(actualPage)
  const [page, setPage] = useState(() => {
    const params = Object.fromEntries(searchParams)
    return params?.page ?? actualPage
  })
  const [totalPages, setTotalPages] = useState(total)
  const pagination = getPagination(totalPages, page)

  const handlePagination = (page = 1) => {
    setPage(page)
    setSearchParams(prevParams => {
      const newSearchParams = Object.fromEntries(prevParams)
      if (+page === 1) {
        delete newSearchParams.page
        return newSearchParams
      }

      return { ...newSearchParams, page }
    })
  }

  // TODO: revisar que nose haya roto la paginación y probar urls con parametros que funcione y nose rompa
  useEffect(() => {
    setPage(actualPage)
    setTotalPages(total)
  }, [actualPage, total])

  return (
    <div className="pagination flex-row flex items-center justify-center py-4">
      <button
        className='p-2 hover:bg-slate-700 transition-all duration-500 ease rounded-md'
        onClick={() => handlePagination(+page - 1)}
        disabled={+page === 1}
      >
        <IconPrevious />
      </button>
      {
        pagination.map((p, i) => {
          return (
            <button
              key={`${i}-${p}`}
              onClick={() => handlePagination(p)}
              disabled={p === '...'}
              className={`
                  p-2 px-4 hover:bg-slate-700 transition-all duration-500 ease rounded-md text-step1
                  ${p === +page ? 'bg-slate-700' : ''}
                `}>
              {p}
            </button>
          )
        })
      }
      <button
        className='p-2 hover:bg-slate-700 transition-all duration-500 ease rounded-md'
        onClick={() => handlePagination(+page + 1)}
        disabled={+page === totalPages || totalPages === 0}
      >
        <IconNext />
      </button>
    </div>
  )
}
