import { useEffect, useState, useRef } from 'react'
import { IconGoTo, IconNext, IconPrevious } from '../../components/ui/Icons'
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Note from '../../services/Notes'
import { useSessionStore } from '../../store/session'
import { getPagination } from '../../helpers/helpers'

export default function Notes () {
  const accessToken = useSessionStore(state => state.accessToken)

  const [notes, setNotes] = useState([])

  const [searchParams, setSearchParams] = useSearchParams()

  const query = useRef('')
  const [size, setSize] = useState(5)
  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pagination = getPagination(totalPages, page)

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleSizeChange = (event) => {
    setSize(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    // setSize(5)
  }

  useEffect(() => {
    if (size === '5' && search === '') {
      setSearchParams({})
    } else {
      setSearchParams(_ => {
        const newSearchParams = { perPage: size, titulo: search }
        if (newSearchParams.titulo === '') delete newSearchParams.titulo
        if (+newSearchParams.perPage === 5) delete newSearchParams.perPage
        return newSearchParams
      })
    }

    query.current = `perPage=${size}&titulo=${search}`

    Note.getNotesByUser({ accessToken, query: query.current })
      .then(data => {
        setTotalPages(data.totalPages)
        setPage(data.page)
        setNotes(data.data)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, search])

  useEffect(() => {
    console.log('NEW FETCH NOTES')
    console.log(Object.fromEntries(searchParams))
    const prevParams = Object.fromEntries(searchParams)
    const keys = Object.keys(prevParams)

    const newQuery = keys.map(k => `${k}=${prevParams[k]}`).join('&')
    console.log(newQuery)

    Note.getNotesByUser({ accessToken, query: newQuery })
      .then(data => {
        setTotalPages(data.totalPages)
        setPage(data.page)
        setNotes(data.data)
      })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    console.log('NEW FETCH NOTES')
    console.log(notes)
  }, [notes])

  return (
    <section className="container">
      <h1 className='font-bold block w-fit mx-auto border-b-2 mt-4 mb-8 leading-tight text-slate-200'>Mis notas</h1>

      <div className="filters flex flex-row justify-between mb-8">
        <div className="sizeResults">
          <select name="sizeResults" id="sizeResults"
            className="text-step1 border border-slate-200 rounded-md px-2 py-1"
            value={size}
            onChange={handleSizeChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <label htmlFor="sizeResults" className='hidden sm:inline-block pl-2'> Resultados por pagina</label>
        </div>

        <div className="searchBox">
          <input type="search" name="search" id="search"
            className="text-step1 border border-slate-200 px-2 py-1 rounded-md" placeholder="Buscar..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="pagination flex-row flex items-center justify-center py-4">
        <a href="" className='p-2 hover:bg-slate-700 transition-all duration-500 ease rounded-md'>
          <IconPrevious />
        </a>
        {
          pagination.map((p, i) => {
            return (
              <button
                key={`${i}-${p}`}
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.set('page', p)
                  console.log(Object.fromEntries(params))

                  setPage(p)
                  navigate(`${pathname}?${params.toString()}`)
                }}
                className={`
                  p-2 px-4 hover:bg-slate-700 transition-all duration-500 ease rounded-md text-step1
                  ${p === +page ? 'bg-slate-700' : ''}
                `}>
                {p}
              </button>
            )
          })
        }
        <a href="" className='p-2 hover:bg-slate-700 transition-all duration-500 ease rounded-md'>
          <IconNext />
        </a>
      </div>

      <table className='text-step2 w-full'>
        <tbody>
          {
            notes.map(note => {
              const urlImage = note.image_url ? note.image_url : '/logo.png'
              return (
                <tr key={note.id_nota} className='border-b-4 border-b-slate-800 group hover:bg-slate-700 transition-colors duration-500 ease'>
                  <td className='p-2 w-32'>
                    <img alt={`Imagen de ${note.title}`} src={urlImage}
                      className='block w-32 rounded-md min-w-[70px] min-h-[70px] object-cover sm:min-w-40 sm:min-h-40'
                    />
                  </td>
                  <td className="flex flex-col py-2 px-4 text-slate-200">
                    <h4 className='font-semibold'>{note.titulo}</h4>
                    {/* <p className='text-step1 whitespace-normal'>{note.description}</p> */}
                    <p className='text-step1 whitespace-normal line-clamp-2'>
                      {note.descripcion}
                    </p>
                  </td>
                  <td className='w-4 pr-4'>
                    <Link to={`/update/${note.id_nota}`} className='block text-step3 transition-transform duration-500 ease group-hover:scale-125'>
                      <IconGoTo />
                    </Link>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </section>
  )
}
