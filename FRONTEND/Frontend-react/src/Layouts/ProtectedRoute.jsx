import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

export default function ProtectedRoute () {
  const { auth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth) {
      navigate('/login')
    }
  }, [])

  return (
    <>
      {/* <h2>Protegida</h2> */}
      <Outlet />
    </>
  )
}
