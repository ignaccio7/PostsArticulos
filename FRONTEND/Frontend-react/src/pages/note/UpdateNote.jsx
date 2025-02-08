import { useState, useEffect, useRef } from 'react'
import InputTitle from '../../components/create-note/InputTitle'
import InputSubtitle from '../../components/create-note/InputSubtitle'
import InputParagraph from '../../components/create-note/inputParagraph'
import InputImage from '../../components/create-note/inputImage'
import Button from '../../components/ui/Button'
import InputIA from '../../components/create-note/InputIA'
import SidebarButtons from '../../components/create-note/sidebarButtons'
import { useParams, useNavigate } from 'react-router-dom'
import Note from '../../services/Notes'
import { useSessionStore } from '../../store/session'
import { toast } from 'sonner'
import ModalConfirm from '../../components/ui/dialog/ModalConfirm'
import { useModal } from '../../hooks/useModal'

const ID_ELEMENT = {
  title: 'T',
  subtitle: 'ST',
  paragraph: 'P',
  image: 'I',
  ia: 'IA'
}

export default function UpdateNote () {
  const accessToken = useSessionStore(state => state.accessToken)
  const { id } = useParams()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const formRef = useRef(null)
  const [elements, setElements] = useState([
    {
      id: 'T1',
      tag: 'title',
      prevElement: null
    },
    {
      id: 'P1',
      tag: 'paragraph',
      prevElement: 'T1'
    }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const { openModal } = useModal()

  useEffect(() => {
    setLoaded(true)
    Note.getNoteByUser({ idNote: id, accessToken })
      .then(data => {
        if (data.statusCode !== 200) navigate('/notes')

        // console.log(data)
        setElements(data.data.jsonData)
      })
      .catch((e) => {
        console.log(e)
        setError(e.message)
        // TODO: validar cuando va a una ruta a update/41 que es de otro usuario te manda al login y luego a notes que sea una sola redireccion
        // if (e.status === 401) navigate('/login')
        // else navigate('/notes')
        // navigate('/notes')
      })
    // if (!id) redirect('/')
  }, [])

  // useEffect(() => {
  //   console.log(formRef.current)
  // }, [elements])

  const addNewElement = ({ tag }) => {
    const newId = elements.filter(el => el.tag === tag).length + 1
    const newElements = [...elements]
    const id = ID_ELEMENT[tag] + newId
    const prevElement = elements[elements.length - 1].id
    newElements.push({ id, tag, prevElement })
    setElements(newElements)
  }

  const deleteElement = () => {
    if (elements.length - 1 < 2) return
    const newElements = elements.slice(0, elements.length - 1)
    setElements(newElements)
  }

  const handleSubmit = async (event) => {
    setIsSubmitting(true)
    event.preventDefault()

    const formData = new FormData()

    // elements.forEach(el => {
    //   if (el.tag === 'title' || el.tag === 'subtitle') {
    //     formData.set(el.id, formRef.current.querySelector(`#${el.id}`).value)
    //   } else if (el.tag === 'image') {
    //     if (formRef.current.querySelector(`#${el.id}`).type === 'text') {
    //       formData.set('imagenes', formRef.current.querySelector(`#${el.id}`).value)
    //     } else {
    //       formData.append('imagenes', formRef.current.querySelector(`#${el.id}`).files[0])
    //     }
    //   } else {
    //     // formData.set(el.id, formRef.current.querySelector(`#${el.id}`).innerHTML)
    //     const content = formRef.current.querySelector(`#${el.id}`).innerText
    //     console.log('El contenido es', content)

    //     if (content.trim().length === 0) return toast.error('No puedes registrar campos vacios')
    //     const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    //     formData.set(el.id, sanitizedContent)
    //   }
    // })
    // Lo pasaremos a un for of respecto  a que no es bloqueante el forEach
    for (const el of elements) {
      if (el.tag === 'title' || el.tag === 'subtitle') {
        if (formRef.current.querySelector(`#${el.id}`).value.trim().length === 0) {
          setIsSubmitting(false)
          toast.error('No puedes registrar campos vacios')
          return // Salimos del bucle si encontramos un campo vacío
        }
        formData.set(el.id, formRef.current.querySelector(`#${el.id}`).value)
      } else if (el.tag === 'image') {
        const inputElement = formRef.current.querySelector(`#${el.id}`)
        if (inputElement.type === 'text') {
          formData.set('imagenes', inputElement.value)
        } else {
          formData.append('imagenes', inputElement.files[0])
        }
      } else {
        const content = formRef.current.querySelector(`#${el.id}`).innerText

        if (content.trim().length === 0) {
          setIsSubmitting(false)
          toast.error('No puedes registrar campos vacios')
          return // Salimos del bucle si encontramos un campo vacío
        }

        const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        formData.set(el.id, sanitizedContent)
      }
    }

    // ACTUALIZAR
    formData.set('order', JSON.stringify(elements))
    console.log(formData)
    console.log(Object.fromEntries(formData))

    console.log('Los elementos')
    console.log(elements)

    try {
      const res = await Note.updateNote({ idNote: id, accessToken, formData })
      console.log(res)
      toast.success('Nota actualizada')
      navigate('/notes')
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteNote = async () => {
    // TODO agregar la paginacion y arreglar los filtros
    try {
      const res = await Note.deleteNote({ idNote: id, accessToken })
      console.log('Se ah eliminado la nota')

      console.log(res)
      toast.success('Nota eliminada')
      navigate('/notes')
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  if (!loaded) {
    return (<div>Cargando...</div>)
  }

  if (error) return (<div className='text-center text-step1 w-full h-full mt-32 flex flex-col text-zinc-400'>Error: {error}</div>)

  return (
    <div className="container relative mb-8">
      <ModalConfirm action={deleteNote}>
        Esta seguro que desea eliminar esta nota?
      </ModalConfirm>

      <h1 className='text-third font-bold inline-block border-b border-dashed border-third mb-4 leading-none'>Actualizar nota</h1>
      <form
        className="note flex flex-col gap-4 mr-32"
        ref={formRef}
        onSubmit={handleSubmit}
        id='createForm'
        encType="multipart/form-data"
      >
        {
          elements.map(element => {
            if (element.tag === 'title') {
              return (
                <InputTitle key={`T${element.id}`} id={element.id} content={element.content} />
              )
            }
            if (element.tag === 'subtitle') {
              return (
                <InputSubtitle key={`ST${element.id}`} id={element.id} content={element.content} />
              )
            }
            if (element.tag === 'image') {
              return (
                <InputImage key={`I${element.id}`} id={element.id} content={element.content} />
              )
            }
            if (element.tag === 'ia') {
              return (
                <InputIA key={`IA${element.id}`} id={element.id} content={element.content} />
              )
            }
            return (
              <InputParagraph key={`P${element.id}`} id={element.id} content={element.content} />
            )
            // }
          })
        }
        <div className="buttons flex gap-4">
          <Button size='lg' type='submit' theme='primary' isSubmitting={isSubmitting}>
            Actualizar nota
          </Button>
          <Button size='lg' onClick={openModal} theme='danger'>
            Eliminar nota
          </Button>
        </div>
      </form>
      <SidebarButtons addNewElement={addNewElement} deleteElement={deleteElement} />
    </div>
  )
}
