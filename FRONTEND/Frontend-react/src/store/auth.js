import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const userAuthStore = create(
  persist(
    (set, get) => {
      return {
        auth: false,

        login () {
          set({ auth: true })
        },

        logout () {
          set({ auth: false })
        }
      }
    },
    {
      name: 'auth'
    }
  )
)

class AuthManager {
  static getAuth() {
    return userAuthStore.getState().auth
  }

  static logoutAuth() {
    userAuthStore.getState().logout()
  }
}

export {
  userAuthStore,
  AuthManager
}