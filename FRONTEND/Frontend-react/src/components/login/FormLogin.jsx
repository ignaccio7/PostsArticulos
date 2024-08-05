import { useState, useEffect, useRef } from 'react'
import { IconLock, IconUser } from '../ui/Icons'
import User from '../../services/User'
import { toast } from 'sonner'

const INITIAL_USER = {
  user: '',
  pass: ''
}

const INITIAL_USER_ERRORS = {
  userError: '',
  passError: ''
}

export default function FormLogin () {
  const [user, setUser] = useState(INITIAL_USER)
  const [error, setError] = useState(INITIAL_USER_ERRORS)
  const isSubmitted = useRef(false)

  const handleChange = (event) => {
    setUser((prevState) => {
      return ({
        ...prevState,
        [event.target.name]: event.target.value
      })
    })
  }

  const validationForm = ({ username, password }) => {
    const newErrors = { ...INITIAL_USER_ERRORS }
    if (username === '') {
      newErrors.userError = 'El usuario es requerido'
    } else if (username.length < 3) {
      newErrors.userError = 'El usuario debe tener por lo menos 3 caracteres'
    } else if (username.length > 15) {
      newErrors.userError = 'El usuario solo puede tener 15 caracteres'
    }

    if (password === '') {
      newErrors.passError = 'La contraseña es requerida'
    } else if (password.length < 8) {
      newErrors.passError = 'La contraseña debe tener por lo menos 8 caracteres'
    } else if (password.length > 20) {
      newErrors.passError = 'La contraseña solo puede tener 20 caracteres'
    }
    return newErrors
  }

  useEffect(() => {
    if (isSubmitted.current) {
      setError(validationForm({ username: user.user, password: user.pass }))
    }
  }, [user])

  const signin = async (event) => {
    event.preventDefault()
    isSubmitted.current = true
    const newErrors = validationForm({ username: user.user, password: user.pass })
    setError(newErrors)
    if (newErrors.userError !== '' || newErrors.passError !== '') return
    console.log('SIGNIN')
    try {
      const data = await User.signin({ user })
      console.log('data es:')
      console.log(data)
    } catch (error) {
      console.log('Error in request')
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form className="form-login" onSubmit={signin} >
      <h2 className="form__title">Inicio de sesion</h2>
      <div className="form__credentials">
        <label>
          <IconUser />
          <input type="text" name='user' placeholder="Usuario"
            onChange={handleChange}
          />
        </label>
        <span className='error'>
          {(error.userError !== '') && (<span>{error.userError}</span>)}
        </span>
        <label>
          <IconLock />
          <input type="password" name='pass' placeholder="Contraseña"
            onChange={handleChange}
          />
        </label>
        <span className='error'>
          {(error.passError !== '') && (<span>{error.passError}</span>)}
        </span>
      </div>
      <div className="form__actions">
        <div>
          <label>
            <input type="checkbox" />
            Recuerdame
          </label>
          <a href="#" className="action__forgot"> Olvidaste tu contraseña? </a>
        </div>
        <button type="submit">
          Login
        </button>
      </div>
      <footer>
        No tienes una cuenta? <label htmlFor="change-form">Registrate</label>
      </footer>
    </form>
  )
}
