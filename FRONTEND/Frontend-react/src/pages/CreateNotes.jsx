import { useState, useEffect, useRef } from 'react'
import InputTitle from '../components/create-note/InputTitle'
import InputSubtitle from '../components/create-note/InputSubtitle'
import InputParagraph from '../components/create-note/inputParagraph'
import InputImage from '../components/create-note/inputImage'
import Button from '../components/ui/Button'
import InputIA from '../components/create-note/InputIA'
import SidebarButtons from '../components/create-note/sidebarButtons'

const ID_ELEMENT = {
  title: 'T',
  subtitle: 'ST',
  paragraph: 'P',
  image: 'I',
  ia: 'IA'
}

export default function CreateNote () {
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

  useEffect(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    console.log(formRef.current)
  }, [elements])

  const addNewElement = ({ tag }) => {
    const newId = elements.filter(el => el.tag === tag).length + 1
    const newElements = [...elements]
    const id = ID_ELEMENT[tag] + newId
    const prevElement = elements[elements.length - 1].id
    newElements.push({ id, tag, prevElement })
    setElements(newElements)
  }

  const deleteElement = () => {
    const newElements = elements.slice(0, elements.length - 1)
    setElements(newElements)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData()

    elements.forEach(el => {
      if (el.tag === 'title' || el.tag === 'subtitle') {
        formData.set(el.id, formRef.current.querySelector(`#${el.id}`).value)
      } else if (el.tag === 'image') {
        formData.set(el.id, formRef.current.querySelector(`#${el.id}`).files[0])
      } else {
        formData.set(el.id, formRef.current.querySelector(`#${el.id}`).textContent)
      }
    })
    formData.set('order', JSON.stringify(elements))
    console.log(formData)
    console.log(Object.fromEntries(formData))
    // TODO send save note
  }

  if (!loaded) {
    return (<div>Cargando...</div>)
  }

  return (
    <div className="container relative mb-8">
      <h1 className='text-third font-bold inline-block border-b border-dashed border-third mb-4 leading-none'>Crear nota</h1>
      <form
        className="note flex flex-col gap-4 mr-32"
        ref={formRef}
        onSubmit={handleSubmit}
        id='createForm'
      >
        {
          elements.map(element => {
            if (element.tag === 'title') {
              return (
                <InputTitle key={`T${element.id}`} id={element.id} />
              )
            }
            if (element.tag === 'subtitle') {
              return (
                <InputSubtitle key={`ST${element.id}`} id={element.id} />
              )
            }
            if (element.tag === 'image') {
              return (
                <InputImage key={`I${element.id}`} id={element.id} />
              )
            }
            if (element.tag === 'ia') {
              return (
                <InputIA key={`IA${element.id}`} id={element.id} />
              )
            }
            return (
              <InputParagraph key={`P${element.id}`} id={element.id} />
            )
            // }
          })
        }
        <Button size='lg'>
          Crear nota
        </Button>
      </form>
      <SidebarButtons addNewElement={addNewElement} deleteElement={deleteElement} />
    </div>
  )
}
