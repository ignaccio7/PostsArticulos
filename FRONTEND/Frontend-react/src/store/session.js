import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSessionStore = create(
  persist(
    (set, get) => {
      return {
        username: '',
        accessToken: '',
        rol: '',
        avatar: '',

        loginUser: async ({ username, token, rol, avatar }) => {
          console.log({ username, token, rol, avatar })

          set({ username, accessToken: token, rol, avatar })
        },
        logoutUser: () => {
          set({ username: '', accessToken: '', rol: '', avatar: '' })
        },
        setAccessToken: (token = '') => {
          set({ accessToken: token })
        }
      }
    },
    {
      name: 'session'
    }
  )
)

// Métodos estáticos para acceder al store sin hooks
class SessionManager {
  static getAccessToken() {
    return useSessionStore.getState().accessToken
  }

  static setAccessToken(token) {    
    useSessionStore.getState().setAccessToken(token)
  }

  static logoutUser() {
    useSessionStore.getState().logoutUser()
  }
} 

export {
  useSessionStore,
  SessionManager
}
