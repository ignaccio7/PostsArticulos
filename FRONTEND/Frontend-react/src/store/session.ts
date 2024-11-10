import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSessionStore = create(
  persist(
    (set, get) => {
      return {
        username: '',
        accessToken: '',

        loginUser: async ({ username, token }) => {
          set({ username, accessToken: token })
        },
        logoutUser: () => {
          set({ username: '', accessToken: '' })
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
