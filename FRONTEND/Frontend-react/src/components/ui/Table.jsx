import { IconGoTo } from './Icons'
import { Link } from 'react-router-dom'

export default function Table ({ results = [] }) {
  return (
    <table className='text-step2 w-full mb-8'>
      <tbody>
        {
          results.length === 0
            ? <tr><td colSpan={4} className='text-center'>Aun no existen notas para mostrar</td></tr>
            : results.map(note => {
              const urlImage = note.image_url ? note.image_url : '/logo.png'
              const descriptionSanitized = note.descripcion.replace('&lt;', '<').replace('&gt;', '>')
              return (
                <tr key={note.id_nota} className='border-b-4 border-b-slate-800 group hover:bg-slate-700 transition-colors duration-500 ease'>
                  <td className='p-2 w-32'>
                    <img alt={`Imagen de ${note.title}`} src={urlImage}
                      className='block w-32 rounded-md min-w-[70px] min-h-[70px] object-cover sm:min-w-40 sm:min-h-40 max-h-[100px]'
                    />
                  </td>
                  <td className="flex flex-col py-2 px-4 text-slate-200 overflow-hidden">
                    <h4 className='font-semibold break-words max-w-[200px] min-[480px]:max-w-none'>{note.titulo}</h4>
                    {/* <p className='text-step1 whitespace-normal'>{note.description}</p> */}
                    <p
                      className='text-step1 whitespace-pre-line line-clamp-2 break-words max-w-[200px] min-[480px]:max-w-none'
                    >
                      {descriptionSanitized}
                    </p>
                  </td>
                  <td className='w-4 pr-4'>
                    <Link to={`/update/${note.id_nota}`} className='block text-step3 transition-transform duration-500 ease group-hover:scale-125'>
                      <IconGoTo />
                    </Link>
                  </td>
                </tr>
              )
            })
        }
      </tbody>
    </table>
  )
}
