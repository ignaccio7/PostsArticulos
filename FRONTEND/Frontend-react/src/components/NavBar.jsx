import InputSearch from './ui/InputSearch'

export default function NavBar () {
  return (
    <div className="nav hidden peer-checked:flex absolute top-28 flex-col gap-4 px-4 inset-x-0 mx-8 bg-primary py-4 rounded-md
    sm:static sm:flex sm:flex-row sm:justify-between sm:flex-1 sm:ml-4 sm:mr-0 sm:bg-transparent sm:items-center sm:py-0
    ">
      <nav className="navigation flex-1 flex flex-col items-start gap-2
      sm:flex-row">
        <a href="" className='w-full cursor-pointer text-left hover:bg-secondary p-2 rounded-md sm:w-auto '>Articulos</a>
        <a href="" className='w-full cursor-pointer text-left hover:bg-secondary p-2 rounded-md sm:w-auto '>Notas</a>
        <a href="" className='w-full cursor-pointer text-left hover:bg-secondary p-2 rounded-md sm:w-auto '>Inicio de Sesion</a>
      </nav>

      <div className="search w-full sm:w-72">
        <InputSearch />
      </div>
    </div>
  )
}
