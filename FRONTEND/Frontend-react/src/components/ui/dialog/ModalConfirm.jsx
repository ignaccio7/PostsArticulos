import { useRef } from 'react'
import { useModal } from '../../../hooks/useModal'

export default function ModalConfirm ({ action = () => { }, children }) {
  const dialogRef = useRef()
  const { showModal, closeModal } = useModal()

  // const hiddenModal = async () => {
  //   dialogRef.current.classList.add('hide')

  //   dialogRef.current.addEventListener('animationend', function close () {
  //     dialogRef.current.classList.remove('hide')
  //     dialogRef.current.close()
  //     dialogRef.current.removeEventListener('animationend', close)
  //     closeModal()
  //   })
  // }

  if (showModal) {
    dialogRef?.current?.showModal()
    dialogRef.current.classList.remove('hide')
  } else {
    dialogRef?.current?.close()
  }

  const closeModalConfirm = () => {
    dialogRef.current.classList.add('hide')
    setTimeout(() => {
      dialogRef.current.close()
      closeModal()
    }, 300) // Esto no es correcto pero asi se soluciona. Agregamos un timeout para que el dialog se cierre correctamente luego de que termina la animacion
  }

  return (
    <dialog ref={dialogRef} className=''>
      {/* className={`${modal ? 'scale-100 opacity-100' : ''} content text-center border-2 border-white p-8 rounded-xl w-[300px] flex flex-col gap-2 items-center bg-zinc-900 transition-all duration-500 opacity-0`} */}
      <div className={'content text-center border-2 border-white p-8 rounded-xl w-[300px] flex flex-col gap-2 items-center bg-zinc-900 transition-all duration-500'}>
        <h3 className='text-step2'>
          {children}
        </h3>
        <div className="buttons flex gap-4">
          <button className='bg-red-600 text-step1 text-white p-2 rounded-xl' onClick={async () => { await action(); closeModal() }}>Eliminar</button>
          {/* onClick={() => setModal(false)} */}
          <button className='bg-blue-600 text-step1 text-white p-2 rounded-xl'
            onClick={closeModalConfirm}>Cancelar</button>
        </div>
      </div>
    </dialog>
  )
}
