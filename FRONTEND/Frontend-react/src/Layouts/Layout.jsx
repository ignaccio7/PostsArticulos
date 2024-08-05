import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Toaster } from 'sonner'

export default function Layout () {
  return (
    <>
      <Toaster />
      <Header />
      <main className='py-2'>
        <Suspense fallback={<div>Cargando...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
