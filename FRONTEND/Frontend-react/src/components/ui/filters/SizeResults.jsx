import { useEffect, useState , useRef } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useRefreshStore } from '../../../store/refresh'

export default function SizeResults () {
  const refresh = useRefreshStore(state => state.refresh)
  const firstRender = useRef(true)

  const [searchParams, setSearchParams] = useSearchParams()
  const [size, setSize] = useState(() => {    
    const params = Object.fromEntries(searchParams)
    return params?.perPage ?? 5
  })
  const handleSizeChange = (event) => {
    const newSize = event.target.value
    setSize(newSize)
    setSearchParams((prevParams) => {
      const newSearchParams = Object.fromEntries(prevParams)

      if (newSearchParams?.page) delete newSearchParams.page

      if (newSize === '5') {
        delete newSearchParams.perPage
        return { ...newSearchParams }
      }

      return { ...newSearchParams, perPage: newSize }
    })
  }
  
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setSize(5)
  }, [refresh])
  
  return (
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
  )
}
