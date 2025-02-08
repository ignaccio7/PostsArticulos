import { useNotesStore } from '../store/notes'

export function useNotesforApprove () {
  // Para publicar articulos
  const notesForApprove = useNotesStore(state => state.notesForApprove)
  const addNewNoteForApprove = useNotesStore(state => state.addNewNoteForApprove)
  const deleteNote = useNotesStore(state => state.deleteNote)
  const clearNotesForApprove = useNotesStore(state => state.clearNotesForApprove)
  // Para eliminar articulos publicados
  const notesForDisapprove = useNotesStore(state => state.notesForDisapprove)
  const addNewNoteForDisapprove = useNotesStore(state => state.addNewNoteForDisapprove)
  const deleteNoteForDisapprove = useNotesStore(state => state.deleteNoteForDisapprove)
  const clearNotesForDisapprove = useNotesStore(state => state.clearNotesForDisapprove)

  const removeNotesForApprove = () => {
    clearNotesForApprove()
    clearNotesForDisapprove()
    localStorage.removeItem('notes-storage')
  }

  return {
    // Para publicar articulos
    notesForApprove,
    addNewNoteForApprove,
    deleteNote,
    clearNotesForApprove,
    removeNotesForApprove,
    // Para eliminar articulos publicados
    notesForDisapprove,
    addNewNoteForDisapprove,
    deleteNoteForDisapprove,
    clearNotesForDisapprove
  }
}
