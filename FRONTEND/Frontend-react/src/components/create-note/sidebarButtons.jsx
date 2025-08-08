import { IconTitle, IconSubtitle, IconText, IconImage, IconIA, IconTrash } from '../ui/Icons'

export default function SidebarButtons ({ addNewElement, deleteElement }) {
  return (
    <div className="buttons fixed right-8 top-40 xl:[right:calc(((100%-1280px)/2)+32px)] flex flex-col gap-2">
        <button
          type='button'
          onClick={() => addNewElement({ tag: 'title' })}
          title='Titulo'
          className='border border-gray border-dashed rounded-md grid place-content-center p-2 hover:bg-third transition duration-300'
        >
          <IconTitle className="size-12" />
        </button>
        <button
          type='button'
          className='border border-gray border-dashed rounded-md grid place-content-center p-2 hover:bg-third transition duration-300'
          onClick={() => addNewElement({ tag: 'subtitle' })}
          title='Subtitulo'
        >
          <IconSubtitle className="size-12" />
        </button>
        <button
          type='button'
          className='border border-gray border-dashed rounded-md grid place-content-center p-2 hover:bg-third transition duration-300'
          onClick={() => addNewElement({ tag: 'paragraph' })}
          title='Descripcion'
        >
          <IconText className="size-12" />
        </button>
        <button
          type='button'
          className='border border-gray border-dashed rounded-md grid place-content-center p-2 hover:bg-third transition duration-300'
          onClick={() => addNewElement({ tag: 'image' })}
          title='Imagen'
        >
          <IconImage className="size-12" />
        </button>
        <button
          type='button'
          className='border border-gray border-dashed rounded-md grid place-content-center p-2 hover:bg-third transition duration-300'
          onClick={() => addNewElement({ tag: 'ia' })}
          title='ChatIA'
        >
          <IconIA className="size-12" />
        </button>
        <button
          type='button'
          className='border border-gray border-dashed rounded-md grid place-content-center p-2 hover:bg-third transition duration-300'
          onClick={deleteElement}
        >
          <IconTrash className="size-12" />
        </button>
      </div>
  )
}
