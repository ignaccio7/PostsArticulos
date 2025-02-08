import { useState, useEffect, useRef, useCallback } from 'react'
import Slider from '../components/Slider'
import Article from '../services/Article'
import GridArticles from '../components/GridArticles'
import GridArticlesSkeleton from '../components/ui/skeleton/GridArticles'
import { useSessionStore } from '../store/session'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { useRefreshStore } from '../store/refresh'

const TOTAL_POPULAR_NOTES = 7

export default function Home () {
  const sentinelRef = useRef(null)

  const [searchParams] = useSearchParams()
  const searchNewArticles = useRefreshStore(state => state.searchNewArticles)
  const toggleSearchNewArticles = useRefreshStore(state => state.toggleSearchNewArticles)

  const [articles, setArticles] = useState([])
  const [page, setPage] = useState('1')
  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(true)
  const accessToken = useSessionStore(state => state.accessToken)

  // TODO: crear un estado global para que cuando el search busque un articulo en el navbar actualizar todo el home

  // const fetchArticles = useCallback(async () => {
  //   // setLoading(true)
  //   try {
  //     const previousParams = Object.fromEntries(searchParams)
  //     const search = previousParams?.titulo ?? ''
  //     const res = await Article.getAll({ accessToken, query: `page=${page}&titulo=${search}` })

  //     setArticles(prevState => {
  //       console.log(prevState)

  //       return page === '1' && prevState.length === 0 ? res.data : [...articles, ...res.data]
  //     })
  //     // setPage(res.page)
  //     totalPages.current = res.totalPages
  //     console.log(res)
  //   } catch (error) {
  //     setArticles([])
  //     console.error('Error fetching articles:', error)
  //     toast.error(error.message)
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [page, searchNewArticles, totalPages, articles])

  const getArticles = async ({ query = '' }) => {
    // setLoading(true)
    try {
      // const previousParams = Object.fromEntries(searchParams)
      // const search = previousParams?.titulo ?? ''
      // const res = await Article.getAll({ accessToken, query: `page=${page}&titulo=${search}` })
      const res = await Article.getAll({ accessToken, query })
      return { data: res.data, page: res.page, totalPages: res.totalPages }
    } catch (error) {
      setArticles([])
      setTotalPages(1)
      setPage('1')
      console.error('Error fetching articles:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const previousParams = Object.fromEntries(searchParams)
    const search = previousParams?.titulo ?? ''
    const query = `titulo=${search}&page=1`
    getArticles({ query })
      .then((res) => {
        setArticles(res.data)
        setTotalPages(res.totalPages)
        setPage(res.page)
      })
  }, [searchNewArticles])

  // Para el sentinel
  useEffect(() => {
    if (!sentinelRef.current) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // console.log(totalPages)

        if (+page === totalPages) return

        const nextPage = +page + 1
        console.log('next page')
        console.log(nextPage)
        console.log(totalPages)
        const prevParams = Object.fromEntries(searchParams)
        const search = prevParams?.titulo ?? ''
        getArticles({ query: `titulo=${search}&page=${nextPage}` })
          .then((res) => {
            setArticles([...articles, ...res.data])
            setTotalPages(res.totalPages)
            setPage(res.page)
          })
      }
    }, { threshold: 1.0 })

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current)
      }
    }
  }, [articles])

  // se le debe pasar la cantidad exacta de multiplos de 3 + 1
  const popularArticles = articles.length > TOTAL_POPULAR_NOTES ? articles.slice(0, TOTAL_POPULAR_NOTES) : []

  const otherArticles = popularArticles.length !== 0 ? articles.slice(TOTAL_POPULAR_NOTES) : [...articles]

  if (loading) return (<section className="container w-full"><GridArticlesSkeleton /></section>)

  return (
    <div>
      <Slider popularArticles={popularArticles} />
      <section className="articles container mb-8">
        <h2 className="">Nuevas cosas en el campo</h2>
        <GridArticles articles={otherArticles} />
      </section>
      <div ref={sentinelRef} className='w-full h-1' />
    </div>
  )
}
