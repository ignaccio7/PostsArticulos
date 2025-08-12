import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Toaster } from 'sonner'
import LayoutLoading from '../components/ui/fallback/LayoutLoading'
import SEO from '../components/SEO'

export default function Layout () {
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
