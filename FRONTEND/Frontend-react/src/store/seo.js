import { create } from 'zustand'
import { TITLE_PROJECT, DESCRIPTION_PROJECT } from '../utils/constants'

const useSEOStore = create((set,get) => {
  return {
    title: TITLE_PROJECT,
    description: DESCRIPTION_PROJECT,
    setSEO: ({ title, description }) => {
      set({
        title, 
        description 
      })
    }
  }
})

export {
  useSEOStore
}