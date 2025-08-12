import { Suspense , useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Toaster } from 'sonner'
import LayoutLoading from '../components/ui/fallback/LayoutLoading'
import SEO from '../components/SEO'
import { useSEO } from '../hooks/useSEO'

export default function Layout () {

  const { changeMetadata } = useSEO()
  const location = useLocation()


  useEffect(() => {
    if (location.pathname.includes('note/')) return
    changeMetadata({
      title: '',
      description: ''
    })
  }, [location.pathname])

  return (
    <>
      <SEO />
      <Toaster />
      <Header />
      <main className='py-2'>
        {/* <Suspense fallback={<div>Cargando...</div>}> */}
        <Suspense fallback={<LayoutLoading/>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
