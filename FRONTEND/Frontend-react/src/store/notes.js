import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useNotesStore = create(persist(
  (set, get) => {
    return {
      // Para publicar articulos

      notesForApprove: [],
      addNewNoteForApprove: (idNote) => {
        const newNotes = [...get().notesForApprove, idNote]
        set({ notesForApprove: newNotes })
      },

      deleteNote: (idNote) => {
        let newNotes = [...get().notesForApprove]
        newNotes = newNotes.filter(note => note !== idNote)

        set({ notesForApprove: newNotes })
      },

      clearNotesForApprove: () => {
        set({ notesForApprove: [] })
      },

      // Para eliminar articulos publicados

      notesForDisapprove: [],
      addNewNoteForDisapprove: (idNote) => {
        const newNotes = [...get().notesForDisapprove, idNote]
        set({ notesForDisapprove: newNotes })
      },

      deleteNoteForDisapprove: (idNote) => {
        let newNotes = [...get().notesForDisapprove]
        newNotes = newNotes.filter(note => note !== idNote)

        set({ notesForDisapprove: newNotes })
      },

      clearNotesForDisapprove: () => {
        set({ notesForDisapprove: [] })
      }
    }
  },
  {
    name: 'notes-storage'
  }
))

export {
  useNotesStore
}
