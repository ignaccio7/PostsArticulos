import { createContext, useState } from 'react'

// 1. Crear el contexto
export const AuthContext = createContext()

// 2. Crear el Provider para proveer el contexto
export function AuthProvider ({ children }) {
  const [auth, setAuth] = useState(false)

  const login = () => {
    setAuth(true)
  }

  const logout = () => {
    setAuth(false)
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
