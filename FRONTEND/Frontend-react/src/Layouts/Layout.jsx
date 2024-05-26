import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Layout () {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/notes">Notes</Link>
      </nav>
      <main>
        <Suspense fallback={<div>Cargando...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <footer>footer</footer>
    </>
  )
}
