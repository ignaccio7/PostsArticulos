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

  const { openModal } = useModal()

  useEffect(() => {
    setLoaded(true)
    Note.getNoteByUser({ idNote: id, accessToken })
      .then(data => {
        if (data.statusCode !== 200) navigate('/notes')

        console.log(data)
        setElements(data.data.jsonData)
      })
      .catch((e) => {
        console.log(e)
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
    event.preventDefault()

    const formData = new FormData()

    elements.forEach(el => {
      if (el.tag === 'title' || el.tag === 'subtitle') {
        formData.set(el.id, formRef.current.querySelector(`#${el.id}`).value)
      } else if (el.tag === 'image') {
        if (formRef.current.querySelector(`#${el.id}`).type === 'text') {
          formData.set('imagenes', formRef.current.querySelector(`#${el.id}`).value)
        } else {
          formData.append('imagenes', formRef.current.querySelector(`#${el.id}`).files[0])
        }
      } else {
        formData.set(el.id, formRef.current.querySelector(`#${el.id}`).innerHTML)
      }
    })

    // ACTUALIZAR
    formData.set('order', JSON.stringify(elements))
    console.log(formData)
    console.log(Object.fromEntries(formData))

    // TODO send save note
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
    }
  }

  const deleteNote = async () => {
    // TODO agregar la paginacion y arreglar los filtros
    try {
      const res = await Note.deleteNote({ idNote: id, accessToken })
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
          <Button size='lg' type='submit' theme='primary'>
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
