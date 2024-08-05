import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute () {
  const { auth } = useAuth()

  if (!auth) {
    return <Navigate to="/" />
  }

  return (
    <>
      {/* <h2>Protegida</h2> */}
      <Outlet />
    </>
  )
}
