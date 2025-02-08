import { useNavigate } from 'react-router-dom'
import FormLogin from '../components/login/FormLogin'
import FormRegister from '../components/login/FormRegister'
import { useAuth } from '../hooks/useAuth'
import '../styles/login.css'
import { useEffect } from 'react'

export default function Login () {
  const navigate = useNavigate()
  const { auth } = useAuth()
  console.log('login')

  useEffect(() => {
    console.log('auth', auth)

    if (auth) navigate('/notes')
  }, [auth, navigate])

  return (
    <div className="container-forms">
      <input type="checkbox" name="change-form" id="change-form" />
      <div className="forms">
        <FormLogin />

        <FormRegister />
      </div>
    </div>
  )
}
