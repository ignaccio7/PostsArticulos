import { useState, useEffect } from 'react'
import Slider from '../components/Slider'
import Article from '../services/Article'
import GridArticles from '../components/GridArticles'
import GridArticlesSkeleton from '../components/ui/skeleton/GridArticles'

const TOTAL_POPULAR_NOTES = 7

export default function Home () {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Article.getAll()
      .then(res => {
        setArticles(res)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching articles:', err)
      })
  }, [])

  // se le debe pasar la cantidad exacta de multiplos de 3 + 1
  const popularArticles = articles.length > TOTAL_POPULAR_NOTES ? articles.slice(0, TOTAL_POPULAR_NOTES) : []

  const otherArticles = popularArticles.length !== 0 ? articles.slice(TOTAL_POPULAR_NOTES) : [...articles]

  if (loading) return (<section className="container w-full"><GridArticlesSkeleton /></section>)

  return (
    <>
      <Slider popularArticles={popularArticles} />
      <section className="articles container mb-8">
        <h2 className="">Nuevas cosas en el campo</h2>
        <GridArticles articles={otherArticles} />
      </section>
    </>
  )
}
