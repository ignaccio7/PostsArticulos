import { useSEO } from '../hooks/useSEO'

export default function SEO() {
  
  const { title, description } = useSEO()

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />    
    </>
  )
}