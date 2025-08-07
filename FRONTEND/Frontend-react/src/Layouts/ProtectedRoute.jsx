import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

export default function ProtectedRoute () {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    console.log('protected Route')
    console.log('auth', auth)
    console.log('location:', location)
    

    if (!auth) {
      console.log('voy al login')
      navigate('/login')
    }
  }, [location.pathname, auth])

  return (
    <>
      {/* <h2>Protegida</h2> */}
      <Outlet />
    </>
  )
}
