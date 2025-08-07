// import { useContext } from 'react'
// import { AuthContext } from '../context/auth.jsx'
import { userAuthStore } from '../store/auth.js'

export function useAuth () {
  // const auth = useContext(AuthContext)
  // Pasamos a usar zustand
  const auth = userAuthStore((state) => state)

  // como buena practica se debe verificar si esta definido o no
  if (auth === undefined) {
    throw new Error('use auth must be used within a AuthProvider')
  }

  return auth
}
