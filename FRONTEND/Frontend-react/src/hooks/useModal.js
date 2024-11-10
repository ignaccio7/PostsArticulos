import { useContext } from 'react'
import { ModalContext } from '../context/modal'

export function useModal () {
  const modal = useContext(ModalContext)
  if (modal === undefined) {
    throw new Error('use modal must be used within a ModalProvider')
  }
  return modal
}
