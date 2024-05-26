import { useContext } from 'react'
import { AuthContext } from '../context/auth'

export function useAuth () {
  const auth = useContext(AuthContext)

  // como buena practica se debe verificar si esta definido o no
  if (auth === undefined) {
    throw new Error('use auth must be used within a AuthProvider')
  }

  return auth
}
