import { useState, useEffect } from 'react'
import Slider from '../components/Slider'
import Article from '../services/Article'
import GridArticles from '../components/GridArticles'

const TOTAL_POPULAR_NOTES = 7

export default function Home () {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    Article.getAll()
      .then(res => {
        setArticles(res)
      })
      .catch(err => {
        console.error('Error fetching articles:', err)
      })
  }, [])

  // se le debe pasar la cantidad exacta de multiplos de 3 + 1
  const popularArticles = articles.length > TOTAL_POPULAR_NOTES ? articles.slice(0, TOTAL_POPULAR_NOTES) : []

  const otherArticles = popularArticles.length !== 0 ? articles.slice(TOTAL_POPULAR_NOTES) : [...articles]

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
