import { create } from 'zustand'

const useRefreshStore = create(
  (set, get) => {
    return {
      searchNewArticles: false,
      toggleSearchNewArticles: () => {
        set({ searchNewArticles: !get().searchNewArticles })
      },
      refresh: false,
      toggleRefresh: () => {
        set({ refresh: !get().refresh })
      }
    }
  }
)

export {
  useRefreshStore
}
