import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSessionStore = create(
  persist(
    (set, get) => {
      return {
        username: '',
        accessToken: '',
        rol: '',

        loginUser: async ({ username, token, rol }) => {
          set({ username, accessToken: token, rol })
        },
        logoutUser: () => {
          set({ username: '', accessToken: '', rol: '' })
        }
      }
    },
    {
      name: 'session'
    }
  )
)

export {
  useSessionStore
}
