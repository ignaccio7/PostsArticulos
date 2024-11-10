import { useState, createContext } from 'react'

export const ModalContext = createContext()

export function ModalProvider ({ children }) {
  const [showModal, setShowModal] = useState(false)

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <ModalContext.Provider
      value={
        {
          showModal,
          openModal,
          closeModal
        }
      }
    >
      {children}
    </ModalContext.Provider>
  )
}
