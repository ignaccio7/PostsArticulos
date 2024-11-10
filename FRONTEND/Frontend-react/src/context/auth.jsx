import { useEffect, createContext, useState } from 'react'

// 1. Crear el contexto
export const AuthContext = createContext()

// 2. Crear el Provider para proveer el contexto
export function AuthProvider ({ children }) {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    const authLocalStorage = localStorage.getItem('auth')
    if (authLocalStorage) setAuth(!!authLocalStorage)
  }, [])

  const login = () => {
    setAuth(true)
    localStorage.setItem('auth', true)
  }

  const logout = () => {
    setAuth(false)
    localStorage.setItem('auth', false)
  }

  return (
    <AuthContext.Provider
      value={
        {
          auth,
          login,
          logout
        }
      }
    >
      {children}
    </AuthContext.Provider>
  )
}
